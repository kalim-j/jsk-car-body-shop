import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city") || "";
  const state = searchParams.get("state") || "Tamil Nadu";
  const type = searchParams.get("type") || "car dealer";
  const location = city || state;
  const apiKey = process.env.FOURSQUARE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ dealers: [], total: 0, error: "FOURSQUARE_API_KEY not set" });
  }

  try {
    // Step 1: Get coordinates via Nominatim (free)
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location + ", India")}&format=json&limit=1`,
      { headers: { "User-Agent": "JSKCarBodyShop/1.0 contact@jskcarbodyshop.com" } }
    );
    const geoData = await geoRes.json();

    if (!geoData?.length) {
      return NextResponse.json({ dealers: [], total: 0, error: "Location not found" });
    }

    const lat = parseFloat(geoData[0].lat);
    const lon = parseFloat(geoData[0].lon);

    // Step 2: Search real businesses via Foursquare
    const url = `https://api.foursquare.com/v3/places/search?query=${encodeURIComponent(type)}&ll=${lat},${lon}&radius=25000&limit=50&fields=fsq_id,name,tel,website,location,categories,rating,stats,hours,geocodes,photos,description`;

    const fsRes = await fetch(url, {
      headers: {
        "Authorization": apiKey,
        "Accept": "application/json"
      }
    });

    if (!fsRes.ok) {
      const errText = await fsRes.text();
      console.error("Foursquare error:", errText);
      return NextResponse.json({ dealers: [], total: 0, error: "Foursquare API failed" });
    }

    const fsData = await fsRes.json();

    if (!fsData.results?.length) {
      return NextResponse.json({ dealers: [], total: 0 });
    }

    const dealers = fsData.results.map((place: any) => {
      const phone = place.tel || null;
      const cleanPhone = phone ? phone.replace(/[\s\-\+]/g, "").replace(/^91/, "") : null;

      return {
        id: place.fsq_id,
        name: place.name,
        phone: phone,
        cleanPhone: cleanPhone,
        whatsappLink: cleanPhone ? `https://wa.me/91${cleanPhone}?text=Hi, I found your business on JSK CAR BODY SHOP dealer network. I am interested in your services.` : null,
        callLink: phone ? `tel:${phone}` : null,
        website: place.website || null,
        address: place.location?.formatted_address || place.location?.address || null,
        city: place.location?.locality || city || state,
        state: place.location?.region || state,
        country: place.location?.country || "India",
        type: place.categories?.[0]?.name || type,
        lat: place.geocodes?.main?.latitude || null,
        lon: place.geocodes?.main?.longitude || null,
        mapsLink: place.geocodes?.main?.latitude
          ? `https://www.google.com/maps?q=${place.geocodes.main.latitude},${place.geocodes.main.longitude}`
          : `https://www.google.com/maps/search/${encodeURIComponent(place.name + " " + (place.location?.locality || location) + " India")}`,
        rating: place.rating ? (place.rating / 2).toFixed(1) : null,
        totalReviews: place.stats?.total_ratings || 0,
        openNow: place.hours?.open_now ?? null,
        photo: place.photos?.[0] ? `${place.photos[0].prefix}300x300${place.photos[0].suffix}` : null,
        description: place.description || null,
        source: "foursquare"
      };
    });

    return NextResponse.json({ dealers, total: dealers.length });

  } catch (error) {
    console.error("Dealer search error:", error);
    return NextResponse.json({ dealers: [], total: 0, error: "Search failed" });
  }
}
