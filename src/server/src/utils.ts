export function parseBody(body: any) {
  const { name, lat, lng, id, description, type } = body;
  const geo = {
    lat,
    lng,
  };
  return { name, _geoloc: geo, id, description, type };
}
