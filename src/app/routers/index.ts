import morgan from 'morgan';
import { Router } from 'express';

const router = Router();
router.use(morgan('tiny'));
router.get('/', (req, res) => res.send('ok'));

export default router;
