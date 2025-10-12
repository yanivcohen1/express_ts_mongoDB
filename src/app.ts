import express, { Request, Response } from 'express';
import helmet from 'helmet';
import authRouter from './routes/auth';
import { authenticate, requireRole } from './middleware/authenticate';
import { errorHandler } from './middleware/errorHandler';
import { HttpError } from './errors/httpError';

const app = express();

app.use(helmet());
app.use(express.json());

app.use('/auth', authRouter);

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.get('/user/profile', authenticate, (req: Request, res: Response) => {
  if (req.user?.role !== 'user') {
    throw new HttpError(403, 'Access restricted to user role.');
  }

  res.json({
    message: 'User profile data',
    user: {
      username: req.user?.username,
      role: req.user?.role
    }
  });
});

app.get('/admin/dashboard', authenticate, requireRole('admin'), (req: Request, res: Response) => {
  res.json({
    message: 'Admin dashboard data',
    user: {
      username: req.user?.username,
      role: req.user?.role
    }
  });
});

app.use(errorHandler);

export default app;
