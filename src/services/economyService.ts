export class EconomyService {
  static async openChest(userId: string, chestId: string): Promise<any> { return null; }
  static async getShopItems(): Promise<any[]> { return []; }
  static async buyItem(userId: string, itemId: string): Promise<any> { return null; }
  static subscribeToInventory(userId: string, callback: any) { return () => {}; }
  static subscribeTo(userId: string, callback: any) { return () => {}; }
  static async equipItem(userId: string, category: string, itemId: string): Promise<any> { return null; }
  static async claimDailyReward(userId: string): Promise<any> { return null; }
  static async startPremiumSubscription(userId: string, planId: string): Promise<any> { return null; }
}
