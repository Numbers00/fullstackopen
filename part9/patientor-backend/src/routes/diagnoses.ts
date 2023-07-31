import express from 'express';

import diagnosisService from '../services/diagnosisService';


const router = express.Router();
router.get('/', (_req, res) => {
  res.send(diagnosisService.getDiagnoses());
});

router.get('/:codes', (req, res) => {
  const codes = req.params.codes.split(',');
  res.send(diagnosisService.getByCode(codes));
});

export default router;
