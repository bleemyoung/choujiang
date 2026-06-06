export interface Participant {
  id: string;
  name: string;
  dept: string;
  mustWinPrizeId: string | null; // 内定中特定奖项 ID，null 为无内定
  banned: boolean;
  weight: number;
}

export interface Winner extends Participant {
  prizeId: string;
  roundId: string;
  wonAt: number;
}

export interface Prize {
  id: string;
  name: string;
  count: number;
  description?: string;  // 奖品描述（如：iPhone 16 Pro）
  image?: string;
}

export interface Settings {
  title: string;
  password: string; // simple local password
  showNeiding: boolean; // 是否显示内定字段
  needPassword: boolean; // 是否需要密码
  welcomeTitle: string;
  welcomeSubtitle: string;
  prizePageTitle: string;  // 奖项页标题
  logo?: string;  // 公司 logo (base64)
  backgroundImage?: string; // 全局背景图 base64
}
