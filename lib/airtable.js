import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_KEY } ).base(process.env.AIRTABLE_BASE);

export async function getJouets( tablename ) {
  const table = base(tablename);
  const records = await table.select();
  const jouets = await records.all();
  const results = jouets.map(item => {
    let fields = item.fields;
    return {
      id: item.id,
      jouet: fields["Produit"],
      code: fields["Code"],
      images: fields["Photos"].map(image => {
        return {
          filename : image.filename,
          url : image.url
        }
      }),
      prix: fields["Prix"],
    }
  })

  return {
    results,
  }
}