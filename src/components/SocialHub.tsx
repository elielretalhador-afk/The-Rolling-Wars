import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Activity, ActivityTrackPoint, SocialPlayer } from '../types';
import { SocialService } from '../services/social';
import { ChatService, ChatMessage } from '../services/chat';
import { FeedService } from '../services/feed';
import { ArrowLeft, Users, Search, MessageCircle, MoreVertical, Heart, MessageSquare, Share2, Circle, Clock, Camera, Video, ChevronDown, Check, X, UserPlus, UserMinus, UserCheck, Newspaper } from 'lucide-react';
import { PerfilView } from './PerfilView';

type SocialTab = 'feed' | 'friends' | 'search' | 'chats' | 'chat_room' | 'profile';

interface SocialHubProps {
  onClose: () => void;
  currentUser: UserProfile;
  initialTab?: SocialTab;
  onRedoRoute?: (activityId: string, metadata?: any) => void;
}

export const SocialHub: React.FC<SocialHubProps> = ({ onClose, currentUser, initialTab = 'feed', onRedoRoute }) => {
  const [activeTab, setActiveTab] = useState<SocialTab>(initialTab);
  const [navHistory, setNavHistory] = useState<SocialTab[]>(['feed']);
  
  // States
  const [feedActivities, setFeedActivities] = useState<Activity[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  
  const [friends, setFriends] = useState<SocialPlayer[]>([]);
  const [friendRequests, setFriendRequests] = useState<SocialPlayer[]>([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResultsPlayers, setSearchResultsPlayers] = useState<SocialPlayer[]>([]);
  const [searchResultsPosts, setSearchResultsPosts] = useState<Activity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTab, setSearchTab] = useState<'ALL' | 'PLAYERS' | 'POSTS'>('ALL');
  
  const [chats, setChats] = useState<{id: string, participant: SocialPlayer, lastMessage?: ChatMessage, unread: number}[]>([]);
  const [activeChat, setActiveChat] = useState<{id: string, participant: SocialPlayer} | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newChatText, setNewChatText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [selectedPlayer, setSelectedPlayer] = useState<SocialPlayer | null>(null);
  
  // Composer
  const [postText, setPostText] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const navigateTo = (tab: SocialTab, skipHistory = false) => {
    setActiveTab(tab);
    if (!skipHistory) {
      setNavHistory(prev => [...prev, tab]);
    }
  };

  const goBack = () => {
    if (navHistory.length > 1) {
      const newHistory = [...navHistory];
      newHistory.pop(); // remove current
      const prevTab = newHistory[newHistory.length - 1];
      setNavHistory(newHistory);
      setActiveTab(prevTab);
    } else {
      onClose();
    }
  };

  useEffect(() => {
    if (activeTab === 'feed') {
      loadFeed();
    } else if (activeTab === 'friends') {
      loadFriends();
    } else if (activeTab === 'chats') {
      loadChats();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeChat && activeTab === 'chat_room') {
      const unsubscribe = ChatService.subscribeToMessages(activeChat.id, (msgs) => {
        setChatMessages(msgs);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      });
      return () => unsubscribe();
    }
  }, [activeChat, activeTab]);

  const loadFeed = async () => {
    setIsLoadingFeed(true);
    try {
      const activities = FeedService.getFeed(currentUser.id, []);
      setFeedActivities(activities);
    } catch (e) {
      console.warn(e);
    }
    setIsLoadingFeed(false);
  };

  const loadFriends = async () => {
    setIsLoadingFriends(true);
    try {
      if (currentUser.authId) {
        const loadedFriends = [] as any[]; //(currentUser.authId, currentUser.authId);
        setFriends(loadedFriends);
        
        const requests = [] as any[]; //(currentUser.authId);
        setFriendRequests(requests);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setIsLoadingFriends(false);
    }
  };

  const loadChats = async () => {
    try {
      if (currentUser.authId) {
        const following = await SocialService.getFollowing(currentUser.authId, currentUser.authId);
        const mapped = following.map(f => ({
          id: ChatService.getChatId(currentUser.authId!, f.id),
          participant: f,
          unread: 0
        }));
        setChats(mapped);
      }
    } catch (e) {}
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const allPlayers = await SocialService.getAllPlayers(currentUser.authId || '');
      const pRes = allPlayers.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.nickname.toLowerCase().includes(searchQuery.toLowerCase()));
      setSearchResultsPlayers(pRes);
      
      const allFeed = FeedService.getFeed(currentUser.id, []);
      const pFeed = allFeed.filter(a => a.description?.toLowerCase().includes(searchQuery.toLowerCase()) || a.title?.toLowerCase().includes(searchQuery.toLowerCase()));
      setSearchResultsPosts(pFeed);
    } catch (e) {
      console.warn(e);
    }
    setIsSearching(false);
  };

  const handlePublish = async () => {
    if (!postText.trim() || !currentUser.authId) return;
    setIsPublishing(true);
    try {
      FeedService.createActivity({
        playerId: currentUser.id,
        authId: currentUser.authId,
        playerNickname: currentUser.nickname,
        playerAvatar: currentUser.avatar || '',
        playerTag: currentUser.tag,
        playerLevel: currentUser.level,
        type: 'TEXT_POST',
        visibility: 'PUBLIC',
        title: 'Publicação',
        description: postText
      });
      setPostText('');
      loadFeed();
    } catch (e) {
      console.warn(e);
    }
    setIsPublishing(false);
  };

  const handleSendMessage = async () => {
    if (!newChatText.trim() || !activeChat || !currentUser.authId) return;
    await ChatService.sendMessage(activeChat.id, currentUser.authId, newChatText);
    setNewChatText('');
  };

  const openProfile = async (player: SocialPlayer) => {
    setSelectedPlayer(player); // Optimistic UI
    navigateTo('profile');
    if (currentUser.authId) {
      const fullProfile = await SocialService.getPublicProfile(player.id);
      if (fullProfile) setSelectedPlayer(fullProfile);
    }
  };

  const openChat = async (player: SocialPlayer) => {
    if (!currentUser.authId) return;
    const chatId = await ChatService.getOrCreateChat(currentUser.authId, player.id);
    setActiveChat({ id: chatId, participant: player });
    navigateTo('chat_room');
  };

  const handleAddFriend = async (player: SocialPlayer) => {
    if (!currentUser.authId) return;
    try {
      await SocialService.sendFriendRequest(currentUser.authId, player.id);
      if (selectedPlayer?.id === player.id) {
        setSelectedPlayer({ ...selectedPlayer, friendRequestStatus: 'PENDING_SENT' });
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleAcceptFriend = async (player: SocialPlayer) => {
    if (!currentUser.authId) return;
    try {
      await SocialService.acceptFriendRequest(player.id, currentUser.authId);
      if (selectedPlayer?.id === player.id) {
        setSelectedPlayer({ ...selectedPlayer, isFriend: true, friendRequestStatus: 'NONE' });
      }
      loadFriends();
    } catch (e) {
      console.warn(e);
    }
  };

  const handleRejectFriend = async (player: SocialPlayer) => {
    if (!currentUser.authId) return;
    try {
      await SocialService.rejectFriendRequest(player.id, currentUser.authId);
      if (selectedPlayer?.id === player.id) {
        setSelectedPlayer({ ...selectedPlayer, friendRequestStatus: 'NONE' });
      }
      loadFriends();
    } catch (e) {
      console.warn(e);
    }
  };

  const handleRemoveFriend = async (player: SocialPlayer) => {
    if (!currentUser.authId) return;
    if (!window.confirm(`Remover ${player.name} dos amigos?`)) return;
    try {
      null; //(currentUser.authId, player.id);
      if (selectedPlayer?.id === player.id) {
        setSelectedPlayer({ ...selectedPlayer, isFriend: false });
      }
      loadFriends();
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#000000] flex flex-col font-sans">
      {/* HEADER COMPACT */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#081330] border-b border-[#000000]/30 shadow-md">
        <button onClick={goBack} className="p-2 -ml-2 text-slate-300 hover:text-white rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => navigateTo('feed')} 
            className={`p-2 rounded-xl transition-colors ${activeTab === 'feed' ? 'text-yellow-400 bg-yellow-400/10' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
          >
            <Newspaper className="w-5 h-5" />
          </button>
          <button 
            onClick={() => navigateTo('friends')} 
            className={`p-2 rounded-xl transition-colors ${activeTab === 'friends' ? 'text-yellow-400 bg-yellow-400/10' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
          >
            <Users className="w-5 h-5" />
          </button>
          <button 
            onClick={() => navigateTo('search')}
            className={`p-2 rounded-xl transition-colors ${activeTab === 'search' ? 'text-yellow-400 bg-yellow-400/10' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
          >
            <Search className="w-5 h-5" />
          </button>
          <button 
            onClick={() => navigateTo('chats')}
            className={`relative p-2 rounded-xl transition-colors ${activeTab === 'chats' || activeTab === 'chat_room' ? 'text-yellow-400 bg-yellow-400/10' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
          >
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar relative">
        {activeTab === 'feed' && (
          <div className="p-4 max-w-lg mx-auto pb-24">
            {/* COMPOSER */}
            <div className="bg-[#000000]/20 border border-[#000000]/50 rounded-2xl p-4 mb-6">
              <div className="flex gap-3">
                <img src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.nickname}`} className="w-10 h-10 rounded-full border border-yellow-400/30 object-cover" />
                <div className="flex-1">
                  <textarea 
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    placeholder="O que você está pensando?"
                    className="w-full bg-transparent text-sm text-white placeholder-slate-400 resize-none outline-none min-h-[40px]"
                  />
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                    <div className="flex gap-2">
                      <button className="text-slate-400 hover:text-yellow-400"><Camera className="w-4 h-4" /></button>
                      <button className="text-slate-400 hover:text-yellow-400"><Video className="w-4 h-4" /></button>
                    </div>
                    <button 
                      onClick={handlePublish}
                      disabled={isPublishing || !postText.trim()}
                      className="px-4 py-1.5 rounded-full bg-yellow-400 text-black text-[10px] font-black uppercase tracking-wider disabled:opacity-50"
                    >
                      {isPublishing ? '...' : 'Publicar'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* FEED LIST */}
            <div className="space-y-4">
              {isLoadingFeed ? (
                <div className="text-center py-8 text-slate-500 font-mono-stat text-xs uppercase">Carregando...</div>
              ) : feedActivities.length > 0 ? (
                feedActivities.map((act, i) => (
                  <div key={`act-${act.id}-${i}`} className="bg-[#102a70]/30 border border-[#000000]/30 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img 
                        src={act.playerAvatar} 
                        className="w-10 h-10 rounded-full border border-slate-700 object-cover cursor-pointer" 
                        onClick={() => {
                          openProfile({ id: act.playerId, name: act.playerNickname || 'Jogador', nickname: (act.playerNickname || '').toLowerCase().replace(/\s/g,'_'), avatar: act.playerAvatar || '', authId: act.authId } as SocialPlayer);
                        }}
                      />
                      <div className="flex-1">
                        <div 
                          className="text-sm font-bold text-slate-200 hover:text-yellow-400 cursor-pointer"
                          onClick={() => {
                            openProfile({ id: act.playerId, name: act.playerNickname || 'Jogador', nickname: (act.playerNickname || '').toLowerCase().replace(/\s/g,'_'), avatar: act.playerAvatar || '', authId: act.authId } as SocialPlayer);
                          }}
                        >{act.playerNickname}</div>
                        <div className="text-[10px] text-slate-500 font-mono-stat flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(act.createdAt).toLocaleDateString()} • {act.visibility === 'PUBLIC' ? 'Público' : 'Amigos'}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-300 mb-3 whitespace-pre-wrap">{act.description}</div>
                    <div className="flex items-center gap-4 pt-3 border-t border-white/5">
                      <button className="flex items-center gap-1.5 text-slate-400 hover:text-yellow-400 transition-colors">
                        <Heart className="w-4 h-4" /> <span className="text-xs font-mono-stat">{act.likesCount || 0}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-slate-400 hover:text-yellow-400 transition-colors">
                        <MessageSquare className="w-4 h-4" /> <span className="text-xs font-mono-stat">{act.commentsCount || 0}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-slate-400 hover:text-yellow-400 transition-colors ml-auto">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 font-mono-stat text-xs uppercase">Nenhuma publicação</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="p-4 max-w-lg mx-auto pb-24">
            
            {friendRequests.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Solicitações de Amizade</h3>
                <div className="space-y-2">
                  {friendRequests.map((req, i) => (
                    <div key={`req-${req.id}-${i}`} className="flex items-center justify-between p-3 bg-[#000000]/20 rounded-xl border border-yellow-400/30">
                      <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => openProfile(req)}>
                        <img src={req.avatar} className="w-10 h-10 rounded-full border border-slate-700 bg-[#090d12]" />
                        <div>
                          <div className="font-bold text-sm text-slate-200">{req.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono-stat">@{req.nickname}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleAcceptFriend(req)} className="p-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleRejectFriend(req)} className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h2 className="text-lg font-black text-white uppercase tracking-wider mb-4 font-display">Amigos</h2>
            {isLoadingFriends ? (
              <div className="text-center py-8 text-slate-500 font-mono-stat text-xs uppercase">Carregando...</div>
            ) : friends.length > 0 ? (
              <div className="space-y-2">
                {friends.map((friend, i) => (
                  <div key={`friend-${friend.id}-${i}`} className="flex items-center justify-between p-3 bg-[#000000]/10 rounded-xl border border-[#000000]/30">
                    <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => openProfile(friend)}>
                      <div className="relative">
                        <img src={friend.avatar} className="w-10 h-10 rounded-full border border-slate-700 bg-[#090d12]" />
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#000000] ${friend.status === 'ONLINE' ? 'bg-yellow-400 shadow-[0_0_8px_#fce803]' : 'bg-slate-500'}`} />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-200">{friend.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono-stat">@{friend.nickname}</div>
                      </div>
                    </div>
                    <button onClick={() => openChat(friend)} className="p-2 text-slate-400 hover:text-yellow-400 bg-white/5 rounded-lg">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 font-mono-stat text-xs uppercase">Nenhum amigo encontrado</div>
            )}
          </div>
        )}

        {activeTab === 'search' && (
          <div className="p-4 max-w-lg mx-auto">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Buscar jogadores ou publicações..."
                className="w-full bg-[#000000]/20 border border-[#000000]/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors placeholder-slate-500"
              />
            </div>
            
            <div className="flex gap-2 mb-4">
              {['ALL', 'PLAYERS', 'POSTS'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setSearchTab(tab as any)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${searchTab === tab ? 'bg-yellow-400 text-black' : 'bg-white/5 text-slate-400'}`}
                >
                  {tab === 'ALL' ? 'Todos' : tab === 'PLAYERS' ? 'Jogadores' : 'Publicações'}
                </button>
              ))}
            </div>

            {isSearching ? (
              <div className="text-center py-8 text-slate-500 font-mono-stat text-xs uppercase">Buscando...</div>
            ) : searchResultsPlayers.length === 0 && searchResultsPosts.length === 0 && searchQuery ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-slate-600 mx-auto mb-3 opacity-50" />
                <h4 className="text-sm font-bold text-slate-300 uppercase">Nenhum resultado encontrado</h4>
                <p className="text-xs text-slate-500 mt-1">Tente outro jogador ou palavra-chave.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {(searchTab === 'ALL' || searchTab === 'PLAYERS') && searchResultsPlayers.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Jogadores</h3>
                    <div className="space-y-2">
                      {searchResultsPlayers.map((p, i) => (
                        <div key={`search-player-${p.id}-${i}`} className="flex items-center gap-3 p-3 bg-[#000000]/10 rounded-xl border border-[#000000]/30 cursor-pointer hover:border-yellow-400/50" onClick={() => openProfile(p)}>
                          <img src={p.avatar} className="w-10 h-10 rounded-full border border-slate-700 bg-[#090d12]" />
                          <div>
                            <div className="font-bold text-sm text-slate-200">{p.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono-stat">@{p.nickname}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(searchTab === 'ALL' || searchTab === 'POSTS') && searchResultsPosts.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Publicações</h3>
                    <div className="space-y-3">
                      {searchResultsPosts.map((act, i) => (
                        <div key={`act-${act.id}-${i}`} className="bg-[#000000]/10 border border-[#000000]/30 rounded-xl p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <img src={act.playerAvatar} className="w-6 h-6 rounded-full" />
                            <span className="text-xs font-bold text-slate-300">{act.playerNickname}</span>
                          </div>
                          <p className="text-sm text-slate-400 line-clamp-2">{act.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'chats' && (
          <div className="p-4 max-w-lg mx-auto">
            <h2 className="text-lg font-black text-white uppercase tracking-wider mb-4 font-display">Mensagens</h2>
            {chats.length > 0 ? (
              <div className="space-y-2">
                {chats.map((chat, i) => (
                  <div key={`chat-${chat.id}-${i}`} className="flex items-center gap-3 p-3 bg-[#000000]/10 rounded-xl border border-[#000000]/30 cursor-pointer hover:border-yellow-400/50" onClick={() => openChat(chat.participant)}>
                    <div className="relative">
                      <img src={chat.participant.avatar} className="w-12 h-12 rounded-full border border-slate-700 bg-[#090d12]" />
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#000000] ${chat.participant.status === 'ONLINE' ? 'bg-yellow-400 shadow-[0_0_8px_#fce803]' : 'bg-slate-500'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-sm text-slate-200 truncate">{chat.participant.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono-stat">{chat.lastMessage?.createdAt ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) : ''}</span>
                      </div>
                      <div className="text-xs text-slate-400 truncate">{chat.lastMessage?.text || 'Inicie uma conversa'}</div>
                    </div>
                    {chat.unread > 0 && (
                      <div className="w-5 h-5 rounded-full bg-yellow-400 text-black flex items-center justify-center text-[9px] font-black">{chat.unread}</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 font-mono-stat text-xs uppercase">Nenhuma conversa</div>
            )}
          </div>
        )}

        {activeTab === 'chat_room' && activeChat && (
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.map((msg, i) => {
                const isMe = msg.senderId === currentUser.authId;
                return (
                  <div key={`msg-${msg.id}-${i}`} className={`flex flex-col max-w-[80%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                    <div className={`px-4 py-2 rounded-2xl text-sm ${isMe ? 'bg-yellow-400 text-black rounded-tr-sm' : 'bg-[#000000]/40 border border-[#000000]/50 text-white rounded-tl-sm'}`}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono-stat mt-1 mx-1">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) : ''}
                    </span>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-3 bg-[#081330] border-t border-[#000000]/30">
              <div className="flex items-center gap-2 max-w-lg mx-auto">
                <input 
                  type="text" 
                  value={newChatText}
                  onChange={e => setNewChatText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Digite uma mensagem..."
                  className="flex-1 bg-[#000000]/20 border border-[#000000]/50 rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors placeholder-slate-500"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!newChatText.trim()}
                  className="w-10 h-10 rounded-full bg-yellow-400 text-black flex items-center justify-center disabled:opacity-50 hover:bg-yellow-300 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 rotate-135" style={{transform: 'rotate(135deg)'}} />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && selectedPlayer && (
          <div className="p-0">
            {/* We can re-use PerfilView or build a lightweight social profile here */}
            {/* Because PerfilView expects currentUser and may have edit controls, we should render a read-only profile */}
            <div className="relative">
              <div className="h-32 bg-gradient-to-b from-[#000000]/40 to-[#000000]" />
              <div className="absolute top-16 inset-x-0 flex flex-col items-center">
                <div className="relative">
                  <img src={selectedPlayer.avatar} className="w-24 h-24 rounded-full border-4 border-[#000000] bg-[#090d12] object-cover" />
                  <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-[#000000] ${selectedPlayer.status === 'ONLINE' ? 'bg-yellow-400 shadow-[0_0_10px_#fce803]' : 'bg-slate-500'}`} />
                </div>
                <h2 className="text-xl font-black text-white mt-2">{selectedPlayer.name}</h2>
                <div className="text-sm text-yellow-400 font-mono-stat font-bold">@{selectedPlayer.nickname}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded bg-white/10 text-xs font-bold text-slate-300">Nvl {selectedPlayer.level || 1}</span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-xs font-bold text-slate-300">{selectedPlayer.xp || 0} XP</span>
                </div>
              </div>
            </div>

            <div className="mt-32 px-6 flex flex-col gap-3">
              <div className="flex justify-center gap-3">
                {selectedPlayer.id === currentUser.authId ? (
                  <button disabled className="flex-1 py-2.5 rounded-xl bg-white/5 text-slate-500 font-black uppercase tracking-wider text-xs flex justify-center items-center gap-2">
                    <Check className="w-4 h-4" /> Seu Perfil
                  </button>
                ) : selectedPlayer.isFriend ? (
                  <button onClick={() => handleRemoveFriend(selectedPlayer)} className="flex-1 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-black uppercase tracking-wider text-xs flex justify-center items-center gap-2 transition-colors">
                    <UserMinus className="w-4 h-4" /> Remover
                  </button>
                ) : selectedPlayer.friendRequestStatus === 'PENDING_SENT' ? (
                  <button disabled className="flex-1 py-2.5 rounded-xl bg-yellow-400/20 text-yellow-400 font-black uppercase tracking-wider text-xs flex justify-center items-center gap-2 cursor-not-allowed">
                    <Clock className="w-4 h-4" /> Enviada
                  </button>
                ) : selectedPlayer.friendRequestStatus === 'PENDING_RECEIVED' ? (
                  <button onClick={() => handleAcceptFriend(selectedPlayer)} className="flex-1 py-2.5 rounded-xl bg-yellow-400 text-black hover:bg-yellow-300 font-black uppercase tracking-wider text-xs flex justify-center items-center gap-2 transition-colors">
                    <UserCheck className="w-4 h-4" /> Aceitar
                  </button>
                ) : (
                  <button onClick={() => handleAddFriend(selectedPlayer)} className="flex-1 py-2.5 rounded-xl bg-yellow-400 text-black hover:bg-yellow-300 font-black uppercase tracking-wider text-xs flex justify-center items-center gap-2 transition-colors">
                    <UserPlus className="w-4 h-4" /> Adicionar
                  </button>
                )}
                
                {selectedPlayer.id !== currentUser.authId && (
                  <button onClick={() => openChat(selectedPlayer)} className="flex-1 py-2.5 rounded-xl bg-[#000000]/30 border border-[#000000]/50 text-white hover:bg-[#000000]/50 font-black uppercase tracking-wider text-xs flex justify-center items-center gap-2 transition-colors">
                    <MessageCircle className="w-4 h-4" /> Mensagem
                  </button>
                )}
              </div>
              {selectedPlayer.id !== currentUser.authId && selectedPlayer.friendRequestStatus === 'PENDING_RECEIVED' && (
                <button onClick={() => handleRejectFriend(selectedPlayer)} className="w-full py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 font-black uppercase tracking-wider text-xs flex justify-center items-center gap-2 hover:bg-rose-500/20 transition-colors">
                  <X className="w-4 h-4" /> Recusar Solicitação
                </button>
              )}
            </div>

            <div className="mt-8 px-4 max-w-lg mx-auto">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Estatísticas</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#000000]/10 border border-[#000000]/30 rounded-xl p-3 text-center">
                  <div className="text-2xl font-black text-white font-mono-stat">{selectedPlayer.zonesControlled || 0}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Zonas</div>
                </div>
                <div className="bg-[#000000]/10 border border-[#000000]/30 rounded-xl p-3 text-center">
                  <div className="text-2xl font-black text-white font-mono-stat">{selectedPlayer.totalKm || 0}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">KM Rodados</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
