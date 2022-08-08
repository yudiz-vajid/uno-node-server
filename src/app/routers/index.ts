import morgan from 'morgan';
import { Router } from 'express';

const router = Router();
router.use(morgan('tiny'));
router.get('/', (req, res) => res.send('ok'));

router.get('/health', (req, res) => {
  res.send('green');
  log.info('health: green');
});

export default router;
