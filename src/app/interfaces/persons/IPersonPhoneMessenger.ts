export interface IPersonPhoneMessenger {
  [id: number]: {
    id: number;
    name: string;
    icon: string;
  }
}


export const messengersMap: IPersonPhoneMessenger = {
  0: {id: 0, name: "None", icon: ""},
  1: {id: 1, name: "Viber", icon: ""},
  2: {id: 2, name: "WhatsApp", icon: ""},
  3: {id: 3, name: "Telegram", icon: ""},
  4: {id: 4, name: "Signal", icon: ""},
  5: {id: 5, name: "WeChat", icon: ""},
}


