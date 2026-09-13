import { 
  collection, doc, getDoc, getDocs, query, where, addDoc, setDoc, 
  deleteDoc, updateDoc, serverTimestamp, runTransaction 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Clan, AppNotificationType } from '../types';
import { SocialService } from './social';

export const ClanService = {
  async createClan(name: string, icon: string, userId: string, userName: string): Promise<string> {
    const clansRef = collection(db, 'clans');
    const q = query(clansRef, where('name', '==', name));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      throw new Error('Já existe um clã com este nome.');
    }


    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    
    const defaultMissions = [
      {
        id: 'mission_1',
        type: 'EXPANSION',
        title: 'Expansão Territorial',
        description: 'Conquiste 5 Zonas neutras.',
        target: 5,
        progress: 0,
        rewardXp: 500,
        status: 'active',
        createdAt: now,
        expiresAt: now + oneWeek
      },
      {
        id: 'mission_2',
        type: 'WAR',
        title: 'Guerra de Clãs',
        description: 'Recupere 3 Zonas de clãs adversários.',
        target: 3,
        progress: 0,
        rewardXp: 800,
        status: 'active',
        createdAt: now,
        expiresAt: now + oneWeek
      },
      {
        id: 'mission_3',
        type: 'DOMINANCE',
        title: 'Domínio Absoluto',
        description: 'Mantenha ou conquiste 5 zonas (progressão geral).',
        target: 5,
        progress: 0,
        rewardXp: 600,
        status: 'active',
        createdAt: now,
        expiresAt: now + oneWeek
      }
    ];

    const docRef = await addDoc(clansRef, {
      name,
      icon,
      leaderId: userId,
      leaderName: userName,
      memberIds: [userId],
      memberCount: 1,
      missions: defaultMissions,
      createdAt: serverTimestamp(),
      members: [{
        id: userId,
        userId: userId,
        name: userName,
        role: 'lider'
      }]
    });

    return docRef.id;
  },

  
  async seedMissions(clanId: string): Promise<void> {
    const clanRef = doc(db, 'clans', clanId);
    const clanSnap = await getDoc(clanRef);
    if (clanSnap.exists()) {
      const data = clanSnap.data();
      if (!data.missions || data.missions.length === 0) {
        const now = Date.now();
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        const defaultMissions = [
          { id: 'm1', type: 'EXPANSION', title: 'Expansão Territorial', description: 'Conquiste 5 Zonas neutras.', target: 5, progress: 0, rewardXp: 500, status: 'active', createdAt: now, expiresAt: now + oneWeek },
          { id: 'm2', type: 'WAR', title: 'Guerra de Clãs', description: 'Recupere 3 Zonas adversárias.', target: 3, progress: 0, rewardXp: 800, status: 'active', createdAt: now, expiresAt: now + oneWeek },
          { id: 'm3', type: 'DOMINANCE', title: 'Domínio Absoluto', description: 'Ajude no domínio geral.', target: 5, progress: 0, rewardXp: 600, status: 'active', createdAt: now, expiresAt: now + oneWeek }
        ];
        await updateDoc(clanRef, { missions: defaultMissions });
      }
    }
  },

  async getClan(clanId: string): Promise<Clan | null> {
    const docRef = doc(db, 'clans', clanId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as Clan;
  },

  async getMyClan(userId: string): Promise<Clan | null> {
    const q = query(collection(db, 'clans'), where('memberIds', 'array-contains', userId));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Clan;
  },

  async getAllClans(): Promise<Clan[]> {
    const snapshot = await getDocs(collection(db, 'clans'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Clan));
  },

  async invitePlayer(clanId: string, clanName: string, inviterId: string, targetUserId: string) {
    const inviteId = `${clanId}_${targetUserId}`;
    const inviteRef = doc(db, 'clanInvites', inviteId);
    
    const inviteSnap = await getDoc(inviteRef);
    if (inviteSnap.exists()) {
      throw new Error('Convite já enviado.');
    }

    await setDoc(inviteRef, {
      clanId,
      userId: targetUserId,
      inviterId,
      status: 'pending',
      createdAt: serverTimestamp()
    });

    // Enviar notificação usando a infraestrutura existente
    await SocialService.sendNotification(
      targetUserId, 
      inviterId, 
      'cla',
      `convidou você para o clã ${clanName}`,
      'open_clan_profile',
      { clanId }
    );
  },

  async getMyInvites(userId: string) {
    const q = query(collection(db, 'clanInvites'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async acceptInvite(inviteId: string, clanId: string, userId: string, userName: string) {
    // Para garantir a segurança e evitar duplicação em clãs, o ideal seria usar runTransaction.
    const inviteRef = doc(db, 'clanInvites', inviteId);
    const clanRef = doc(db, 'clans', clanId);

    await runTransaction(db, async (transaction) => {
      const clanDoc = await transaction.get(clanRef);
      if (!clanDoc.exists()) throw new Error('Clã não encontrado.');

      const data = clanDoc.data();
      if (data.memberIds.includes(userId)) {
        // Já é membro, apenas limpa o convite
        transaction.delete(inviteRef);
        return;
      }

      const newMembers = [...(data.members || []), {
        id: userId,
        userId: userId,
        name: userName,
        role: 'membro'
      }];

      transaction.update(clanRef, {
        memberIds: [...data.memberIds, userId],
        memberCount: data.memberCount + 1,
        members: newMembers
      });
      transaction.delete(inviteRef);
    });
  },

  async rejectInvite(inviteId: string) {
    await deleteDoc(doc(db, 'clanInvites', inviteId));
  },

  async leaveClan(clanId: string, userId: string) {
    const clanRef = doc(db, 'clans', clanId);
    
    await runTransaction(db, async (transaction) => {
      const clanDoc = await transaction.get(clanRef);
      if (!clanDoc.exists()) throw new Error('Clã não encontrado.');

      const data = clanDoc.data();
      if (!data.memberIds.includes(userId)) return;

      if (data.leaderId === userId) {
        if (data.memberCount > 1) {
          throw new Error('Você é o líder. Transfira a liderança antes de sair.');
        } else {
          // Último membro e líder: deleta o clã
          transaction.delete(clanRef);
          return;
        }
      }

      const updatedMemberIds = data.memberIds.filter((id: string) => id !== userId);
      const updatedMembers = data.members.filter((m: any) => m.userId !== userId);

      transaction.update(clanRef, {
        memberIds: updatedMemberIds,
        memberCount: data.memberCount - 1,
        members: updatedMembers
      });
    });
  }
};
