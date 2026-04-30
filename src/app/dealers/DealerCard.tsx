import { MapPin, Star, ShieldCheck, Clock } from "lucide-react";

interface DealerCardProps {
  dealer: any; // Using any to handle both Foursquare and old Supabase schema gracefully
  onContact?: (dealer: any) => void;
}

export default function DealerCard({ dealer, onContact }: DealerCardProps) {
  const photoUrl = dealer.photo || (dealer.images && dealer.images.length > 0 ? dealer.images[0] : null);
  const rating = dealer.rating || dealer.average_rating || 0;
  const totalReviews = dealer.totalReviews || dealer.total_reviews || 0;
  const isVerified = dealer.is_verified || dealer.source === "foursquare";

  return (
    <div className="bg-charcoal-950 border border-white/5 rounded-2xl overflow-hidden hover:border-gold-500/30 transition-all group flex flex-col h-full shadow-lg">
      <div className="h-40 bg-charcoal-900 relative flex items-center justify-center p-4">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={dealer.name}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity absolute inset-0"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-charcoal-800 to-black/50" />
        )}
        
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isVerified && (
            <div className="bg-green-500/20 text-green-400 backdrop-blur-md px-2 py-1 rounded text-xs font-bold flex items-center gap-1 border border-green-500/30 w-fit">
              <ShieldCheck size={12} /> VERIFIED
            </div>
          )}
          {dealer.openNow !== undefined && dealer.openNow !== null && (
            <span className={`text-xs px-2 py-1 rounded w-fit border backdrop-blur-md flex items-center gap-1 ${dealer.openNow ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
              <Clock size={10} /> {dealer.openNow ? 'Open Now' : 'Closed'}
            </span>
          )}
        </div>

        {rating > 0 && (
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10 flex items-center gap-1">
            <Star size={12} className="text-gold-500 fill-gold-500" />
            <span className="text-gold-400 text-xs font-bold">{Number(rating).toFixed(1)}</span>
            <span className="text-charcoal-400 text-[10px]">({totalReviews})</span>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="text-xl font-display font-bold text-white group-hover:text-gold-400 transition-colors line-clamp-1">
            {dealer.name}
          </h3>
          <p className="text-charcoal-400 text-sm flex items-start gap-1 mt-1">
            <MapPin size={14} className="shrink-0 mt-0.5 text-gold-500" />
            <span className="line-clamp-2">{dealer.address}, {dealer.city}, {dealer.state}</span>
          </p>
        </div>

        {dealer.ai_score > 0 && (
          <div className="mb-4 bg-gold-500/10 border border-gold-500/20 rounded-lg p-3 group/tooltip relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gold-400">AI Trust Score</span>
              <span className="text-sm font-bold text-white">{dealer.ai_score}/100</span>
            </div>
            <p className="text-[11px] text-charcoal-300 mt-1 line-clamp-2">
              {dealer.ai_recommendation_reason}
            </p>
          </div>
        )}

        <div className="mb-4 space-y-3 flex-1">
           {dealer.type && (
            <div>
              <p className="text-[10px] text-charcoal-500 uppercase font-semibold tracking-wider mb-1.5">Dealer Type</p>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs text-charcoal-300 bg-white/5 px-2 py-1 rounded border border-white/10 capitalize">
                  {typeof dealer.type === 'string' ? dealer.type : (dealer.dealer_type?.[0] || 'Unknown')}
                </span>
              </div>
            </div>
           )}
        </div>

        <div className="flex flex-col gap-2 pt-4 border-t border-white/5 mt-auto">
          <div className="flex gap-2">
            {dealer.callLink ? (
              <a href={dealer.callLink} className="flex-1 flex items-center justify-center gap-2 bg-charcoal-800 hover:bg-charcoal-700 border border-white/5 text-white text-xs px-2 py-2 rounded-lg transition-colors">
                📞 Call
              </a>
            ) : (
              dealer.phone && (
                <a href={`tel:${dealer.phone}`} className="flex-1 flex items-center justify-center gap-2 bg-charcoal-800 hover:bg-charcoal-700 border border-white/5 text-white text-xs px-2 py-2 rounded-lg transition-colors">
                  📞 Call
                </a>
              )
            )}

            {dealer.whatsappLink ? (
              <a href={dealer.whatsappLink} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-green-700/80 hover:bg-green-600 border border-green-500/20 text-white text-xs px-2 py-2 rounded-lg transition-colors">
                💬 WhatsApp
              </a>
            ) : (
               <div className="flex-1 flex items-center justify-center gap-2 bg-charcoal-900 border border-white/5 text-charcoal-500 text-xs px-2 py-2 rounded-lg">
                 📵 No Phone
               </div>
            )}
          </div>

          <div className="flex gap-2">
            {dealer.mapsLink ? (
              <a href={dealer.mapsLink} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-blue-700/80 hover:bg-blue-600 border border-blue-500/20 text-white text-xs px-2 py-2 rounded-lg transition-colors">
                🗺️ Maps
              </a>
            ) : (
              <a href={`https://www.google.com/maps/search/${encodeURIComponent(dealer.name + " " + dealer.city + " India")}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-blue-700/80 hover:bg-blue-600 border border-blue-500/20 text-white text-xs px-2 py-2 rounded-lg transition-colors">
                🗺️ Maps
              </a>
            )}
            
            {onContact && (
              <button onClick={() => onContact(dealer)} className="flex-1 flex items-center justify-center gap-2 btn-gold text-black text-xs font-bold px-2 py-2 rounded-lg">
                ✉️ Inquiry
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
