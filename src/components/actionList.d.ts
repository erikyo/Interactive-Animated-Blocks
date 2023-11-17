

export interface AnimBaseObj {
  [actionKey: string] : {
    value: number | string;
    duration: number | string;
    easing: string;
    delay?: number;
    endDelay?: number;
  }
}
export interface SSCAction extends AnimBaseObj {
  id: number;
  key: string;
}

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


interface propsType {
  type: string;
  data: SSCStep[];
  onSave: (data: SSCStep[]) => void;
}

interface ISSCAnimation {
  sscSteps: SSCStep[];

  addSSCStep: () => void;
  addSSCAction: (sscStep: SSCStep) =>void,

  removeSSCStep: (sscStepId: number) => void;
  removeSSCAction: (sscStep: SSCStep, sscActionId: number) =>void,

  updateSSCStep: (sscStep: SSCStep) => void;
  updateSSCAction: (sscStep: SSCStep, sscAction: SSCAction) =>void,

  sortSSCSteps: (sscStepId: number) => void,
  sortSSCActions: (sscStepId: number, sscActionId: number) =>void,

  updateSSCAnimeBaseObject: (sscStepId: number, sscAction: SSCAction, sscAnimeObj: AnimBaseObj) => void,
}
