'use client';

import { useState } from 'react';
import { 
  MessagesSquare, Heart, MessageCircle, Share2, 
  Send, Trophy, TrendingUp, Users, Plus
} from 'lucide-react';

interface Post {
  id: number;
  author: string;
  avatar: string;
  role: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
  tag?: string;
}

const initialPosts: Post[] = [
  { id: 1, author: 'Akossiwa Dossou', avatar: 'AD', role: 'Top Affiliate', time: 'Il y a 2h', content: '🎉 Incroyable ! J\'ai atteint 2 000 000 FCFA de commissions ce mois-ci grâce à la formation Marketing Digital. Merci AfiliPro pour cette opportunité ! Qui d\'autre l\'a promue ?', likes: 45, comments: 12, shares: 8, liked: false, tag: 'Success Story' },
  { id: 2, author: 'Moussa Traoré', avatar: 'MT', role: 'YouTubeur Tech', time: 'Il y a 5h', content: 'Astuce du jour : utilisez des vidéos de démonstration pour vos liens d\'affiliation. Mes conversions ont augmenté de 40% ! 📈', likes: 89, comments: 23, shares: 34, liked: true, tag: 'Astuce' },
  { id: 3, author: 'Aminata Diallo', avatar: 'AD', role: 'Influenceuse Beauté', time: 'Il y a 8h', content: 'Le Coffret Soins Premium est en promotion cette semaine. Commission doublée pour les affiliés ! Profitez-en 🎁', likes: 67, comments: 15, shares: 22, liked: false, tag: 'Bon Plan' },
  { id: 4, author: 'Koffi Agbéko', avatar: 'KA', role: 'Gold Member', time: 'Hier', content: 'Question : quelqu\'un a-t-il testé le programme Trading Tutorials ? Les récompenses ont l\'air intéressantes mais je veux des retours d\'expérience.', likes: 23, comments: 31, shares: 4, liked: false, tag: 'Question' },
];

const trendingTopics = [
  { tag: '#FormationMarketing', posts: 234 },
  { tag: '#SmartwatchFitness', posts: 189 },
  { tag: '#ProgrammeMinceur', posts: 156 },
  { tag: '#AstuceAffiliation', posts: 145 },
  { tag: '#SuccessStory', posts: 132 },
];

const topMembers = [
  { name: 'Akossiwa Dossou', earnings: '2 127 000 FCFA', avatar: 'AD', rank: 1 },
  { name: 'Moussa Traoré', earnings: '1 893 000 FCFA', avatar: 'MT', rank: 2 },
  { name: 'Aminata Diallo', earnings: '1 411 000 FCFA', avatar: 'AD', rank: 3 },
  { name: 'Kodjo Mensah', earnings: '1 865 000 FCFA', avatar: 'KM', rank: 4, isMe: true },
];

export default function CommunityPage() {
  const [posts, setPosts] = useState(initialPosts);
  const [newPost, setNewPost] = useState('');

  const handleLike = (id: number) => {
    setPosts(posts.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post: Post = { id: Date.now(), author: 'Kodjo Mensah', avatar: 'KM', role: 'Gold Member', time: 'À l\'instant', content: newPost, likes: 0, comments: 0, shares: 0, liked: false };
    setPosts([post, ...posts]);
    setNewPost('');
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3"><div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center"><MessagesSquare className="w-6 h-6" /></div><h1 className="text-3xl font-bold font-display">Community Hub</h1></div>
          <p className="text-white/80">Échangez avec la communauté AfiliPro</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* New Post */}
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-yellow-600 flex items-center justify-center font-bold text-white flex-shrink-0">KM</div>
              <div className="flex-1">
                <textarea value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder="Partagez votre expérience, posez une question..." className="w-full p-3 bg-gray-50 rounded-xl border border-transparent focus:border-primary focus:bg-white outline-none resize-none text-sm" rows={3} />
                <div className="flex items-center justify-end mt-3">
                  <button onClick={handlePost} disabled={!newPost.trim()} className="btn-primary py-2 px-4 text-sm flex items-center gap-2 disabled:opacity-50"><Send className="w-4 h-4" /> Publier</button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts */}
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center font-bold text-white flex-shrink-0">{post.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2"><span className="font-bold text-gray-900">{post.author}</span><span className="text-xs px-2 py-0.5 bg-accent/10 text-accent rounded-full font-semibold">{post.role}</span></div>
                  <div className="text-xs text-gray-500">{post.time}</div>
                </div>
                {post.tag && <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-semibold">{post.tag}</span>}
              </div>
              <p className="text-gray-700 mb-4">{post.content}</p>
              <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
                <button onClick={() => handleLike(post.id)} className={`flex items-center gap-2 text-sm font-medium transition-colors ${post.liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}><Heart className={`w-5 h-5 ${post.liked ? 'fill-red-500' : ''}`} />{post.likes}</button>
                <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors"><MessageCircle className="w-5 h-5" />{post.comments}</button>
                <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors"><Share2 className="w-5 h-5" />{post.shares}</button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold font-display text-gray-900 mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-accent" /> Top Membres</h3>
            <div className="space-y-3">
              {topMembers.map((member) => (
                <div key={member.rank} className={`flex items-center gap-3 p-3 rounded-xl ${'isMe' in member && member.isMe ? 'bg-accent/10 border border-accent/20' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${member.rank === 1 ? 'bg-yellow-400 text-white' : member.rank === 2 ? 'bg-gray-300 text-white' : member.rank === 3 ? 'bg-orange-400 text-white' : 'bg-gray-100 text-gray-600'}`}>{member.rank}</div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center font-bold text-white text-sm">{member.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm truncate">{member.name}{'isMe' in member && member.isMe && <span className="text-xs text-accent ml-1">(Vous)</span>}</div>
                    <div className="text-xs text-gray-500">{member.earnings}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold font-display text-gray-900 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-success" /> Sujets Tendances</h3>
            <div className="space-y-2">
              {trendingTopics.map((topic, i) => (
                <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer"><span className="text-sm font-medium text-primary">{topic.tag}</span><span className="text-xs text-gray-500">{topic.posts} posts</span></div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary to-blue-700 rounded-2xl p-6 text-white">
            <h3 className="font-bold font-display mb-4 flex items-center gap-2"><Users className="w-5 h-5" /> Communauté</h3>
            <div className="space-y-3">
              <div><div className="text-2xl font-bold font-display">15 847</div><div className="text-xs text-blue-200">Membres actifs</div></div>
              <div><div className="text-2xl font-bold font-display">1 234</div><div className="text-xs text-blue-200">Posts aujourd'hui</div></div>
              <div><div className="text-2xl font-bold font-display">89%</div><div className="text-xs text-blue-200">Taux de réponse</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
