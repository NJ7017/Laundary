const SERVICEABLE_PINS = [
  '411057', '411045', '411027', '411028', '411038', '411033', '411014', '411001',
  '560001', '560100', '560066', '400001', '400050', '110001', '122001', '500081'
];

export async function onRequestGet(context) {
  const { params } = context;
  const pin = (params.zip || '').trim();

  const serviceable = SERVICEABLE_PINS.includes(pin);

  return Response.json({
    zip: pin,
    serviceable,
    message: serviceable
      ? `Great news! AuraWash electric vans service PIN ${pin}.`
      : 'We have not expanded to this PIN code yet, but join our waiting list for updates!'
  });
}
