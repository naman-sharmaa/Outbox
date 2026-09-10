import { Router } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from '../config/env';
import { prisma } from '../services/db';
import axios from 'axios';
import nodemailer from 'nodemailer';

const router = Router();

// Setup Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleAuth.clientID || 'dummy',
      clientSecret: config.googleAuth.clientSecret || 'dummy',
      callbackURL: config.googleAuth.callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) return done(new Error('No email found from Google'));

        let user = await prisma.user.findUnique({ where: { googleId: profile.id } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              email,
              name: profile.displayName,
              avatarUrl: profile.photos?.[0].value,
            },
          });

          // Auto-provision an Ethereal sender account for testing
          try {
            const testAccount = await nodemailer.createTestAccount();
            await prisma.senderAccount.create({
              data: {
                userId: user.id,
                email: testAccount.user,
                pass: testAccount.pass,
              },
            });
          } catch (accountErr) {
            console.error('Failed to auto-create ethereal account', accountErr);
          }
        }
        return done(null, user);
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(config.frontendUrl + '/dashboard');
  }
);

router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

router.post('/logout', (req, res) => {
  req.logout(() => {
    res.json({ success: true });
  });
});

// Slack OAuth v2
router.get('/slack', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send('Must be logged in to connect Slack');
  }
  const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${config.slackAuth.clientID}&scope=incoming-webhook,chat:write&redirect_uri=${encodeURIComponent(
    'http://localhost:' + config.port + '/auth/slack/callback'
  )}&state=${(req.user as any).id}`;
  res.redirect(slackAuthUrl);
});

router.get('/slack/callback', async (req, res) => {
  const code = req.query.code as string;
  const userId = req.query.state as string;

  if (!code || !userId) {
    return res.redirect(config.frontendUrl + '/dashboard?error=slack_auth_failed');
  }

  try {
    const response = await axios.post(
      'https://slack.com/api/oauth.v2.access',
      new URLSearchParams({
        client_id: config.slackAuth.clientID,
        client_secret: config.slackAuth.clientSecret,
        code,
        redirect_uri: 'http://localhost:' + config.port + '/auth/slack/callback',
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const data = response.data;
    if (data.ok) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          slackWebhookUrl: data.incoming_webhook?.url || null,
          slackToken: data.access_token || null,
        },
      });
      res.redirect(config.frontendUrl + '/dashboard?slack_connected=true');
    } else {
      console.error('Slack OAuth Error:', data.error);
      res.redirect(config.frontendUrl + '/dashboard?error=slack_auth_failed');
    }
  } catch (err) {
    console.error('Slack Callback Error:', err);
    res.redirect(config.frontendUrl + '/dashboard?error=slack_auth_failed');
  }
});

export default router;
