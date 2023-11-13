export type AnimBaseObj = {
  [actionKey: string] : {
    value: number | string;
    duration: number;
    easing: string;
    delay?: number;
    endDelay?: number;
    isValueArray?: boolean;
    handleActionChange?: (e: string, data: any) => void;
  }
};
export interface SSCAction extends AnimBaseObj {
  id: number;
  key: string;
  handleStepChange?: (e: string, data: any) => void;
  getKeyValue(key: keyof AnimBaseObj): number | string | undefined;
  findIndex?: (id: number) => number;

};

export interface SSCStep {
  id: number;
  key: string;
  actions?: SSCAction[];
  delay?: number;
  endDelay?: number;
  valueDefault?: string;
  isScalableX?: boolean;
  isScalableY?: boolean;

}

export interface ActionRowProps extends SSCStep {
  id: number;
  stepList: label[];
  handlechange: (
    arg0: string,
    arg1: {
      id: any;
      changed: string;
      action: any;
      value: any;
      duration: any;
    }
  ) => void;
  removeaction: (arg0: any) => any;
}
