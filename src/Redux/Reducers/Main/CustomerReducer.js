import { CustomerTypeAction } from "../../Actions/Main";
const initialState = {
  Customer: {},
  CustomerCheckPhoneResult: {},
  CustomerCheckEmailResult: {},
  CustomerResetPassResult:{},
  CustomerCheckResetPassResult:{},
  CustomerChangeAvatarResult:{},
  CustomerFogotPassResult:{},
};

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case CustomerTypeAction.APIC_spCustomerCheckLogin_SUCCESS:
      return {
        ...state,
        Customer: action.payload,
      };
    case CustomerTypeAction.APIC_spCustomerGetById_SUCCESS:
      return {
        ...state,
        Customer: action.payload,
      };
    case CustomerTypeAction.APIC_spCustomerCheckPhone_SUCCESS:
      return {
        ...state,
        CustomerCheckPhoneResult: action.payload,
      };
    case CustomerTypeAction.APIC_spCustomerCheckEmail_SUCCESS:
      return {
        ...state,
        CustomerCheckEmailResult: action.payload,
      };
    case CustomerTypeAction.APIC_spCustomerUpdateInfo_SUCCESS:
      return {
        ...state,
        Customer: action.payload,
      };
    case CustomerTypeAction.APIC_spCustomerRegister_SUCCESS:
      return {
        ...state,
        Customer: action.payload,
      };
    case CustomerTypeAction.APIC_CustomerSendEmailForgot_SUCCESS:
      return {
        ...state,
        CustomerFogotPassResult: action.payload,
      };
    case CustomerTypeAction.APIC_CustomerCheckResetPass_SUCCESS:
      return {
        ...state,
        CustomerCheckResetPassResult: action.payload,
      };
    case CustomerTypeAction.APIC_spCustomerResetPass_SUCCESS:
      return {
        ...state,
        APIC_spCustomerResetPassResult: action.payload,
      };
    default:
      return state;
  }
}
