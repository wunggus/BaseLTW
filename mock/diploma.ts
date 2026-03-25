let counter = 1;

export default {
  'GET /api/diplomas': (req: any, res: any) => {
    res.send([
      {
        id: '1',
        soVaoSo: 1,
        soHieu: 'DH001',
        msv: 'B19DCCN001',
        hoTen: 'Nguyen Van A',
        ngaySinh: '2000-01-01',
        decisionId: '1',
      }
    ]);
  },

  'POST /api/diplomas': (req: any, res: any) => {
    const body = req.body;
    res.send({
      ...body,
      id: Date.now().toString(),
      soVaoSo: counter++
    });
  }
};