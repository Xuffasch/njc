export default async (req, res) => {
  const item = req.body.records[0].fields;
  const orderId = 6;

  const bearer = `Bearer ${process.env.AIRTABLE_KEY}`;

  const airtable = 'https://api.airtable.com/v0/appLrqJrpxyq22Lyu/Commandes';

  const result = await fetch(airtable, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': bearer
        },
        body: JSON.stringify({
          records: [
              {
                fields: {
                  'order': orderId,
                  'jouet': item.jouet,
                  'code': item.code,
                  'prix': Number(item.prix)
                },
              },
          ],
        })
      }).then(result => {
        if (result.status == 422) {
          return { err: 422, message: 'Bad data format for article' }
        } else {
          return { message: 'Order ' + orderId + ' created'};
        }
      }).catch(err => {
        return { err: 500, message: `Technical error ${err.code}` };
      })

    res.status( result.err ? result.err : 200);
    res.json( { message: result.message } );
}