import { CustomerTypeAction } from ".";

export function APIC_spCustomerCheckLogin(params, dispatch) {
  return new Promise((resolve, reject) => {
    dispatch({
      type: CustomerTypeAction.APIC_spCustomerCheckLogin,
      params,
      resolve,
      reject,
    });
  });
}

export function APIC_spCustomerGetById(params, dispatch) {
  return new Promise((resolve, reject) => {
    dispatch({
      type: CustomerTypeAction.APIC_spCustomerGetById,
      params,
      resolve,
      reject,
    });
  });
}

export function APIC_spCustomerGetByGroup(params, dispatch) {
  return new Promise((resolve, reject) => {
    dispatch({
      type: CustomerTypeAction.APIC_spCustomerGetByGroup,
      params,
      resolve,
      reject,
    });
  });
}

export function APIC_spCustomerCheckPhone(params, dispatch) {
  return new Promise((resolve, reject) => {
    dispatch({
      type: CustomerTypeAction.APIC_spCustomerCheckPhone,
      params,
      resolve,
      reject,
    });
  });
}

export function APIC_spCustomerCheckEmail(params, dispatch) {
  return new Promise((resolve, reject) => {
    dispatch({
      type: CustomerTypeAction.APIC_spCustomerCheckEmail,
      params,
      resolve,
      reject,
    });
  });
}

export function APIC_spCustomerUpdateInfo(params, dispatch) {
  return new Promise((resolve, reject) => {
    dispatch({
      type: CustomerTypeAction.APIC_spCustomerUpdateInfo,
      params,
      resolve,
      reject,
    });
  });
}

export function APIC_spCustomerRegister(params, dispatch) {
  return new Promise((resolve, reject) => {
    dispatch({
      type: CustomerTypeAction.APIC_spCustomerRegister,
      params,
      resolve,
      reject,
    });
  });
}

export function APIC_CustomerSendEmailForgot(params, dispatch) {
  return new Promise((resolve, reject) => {
    dispatch({
      type: CustomerTypeAction.APIC_CustomerSendEmailForgot,
      params,
      resolve,
      reject,
    });
  });
}

export function APIC_CustomerCheckResetPass(params, dispatch) {
  return new Promise((resolve, reject) => {
    dispatch({
      type: CustomerTypeAction.APIC_CustomerCheckResetPass,
      params,
      resolve,
      reject,
    });
  });
}

export function APIC_spCustomerResetPass(params, dispatch) {
  return new Promise((resolve, reject) => {
    dispatch({
      type: CustomerTypeAction.APIC_spCustomerResetPass,
      params,
      resolve,
      reject,
    });
  });
}

export function APIC_spCustomerChangeAvatar(params, dispatch) {
  return new Promise((resolve, reject) => {
    dispatch({
      type: CustomerTypeAction.APIC_spCustomerChangeAvatar,
      params,
      resolve,
      reject,
    });
  });
}

export function APIC_spCustomerRecipientLoad(params, dispatch) {
  return new Promise((resolve, reject) => {
    dispatch({
      type: CustomerTypeAction.APIC_spCustomerRecipientLoad,
      params,
      resolve,
      reject,
    });
  });
}

export function APIC_spCustomerRecipientRemove(params, dispatch) {
  return new Promise((resolve, reject) => {
    dispatch({
      type: CustomerTypeAction.APIC_spCustomerRecipientRemove,
      params,
      resolve,
      reject,
    });
  });
}

  export function APIC_spCustomerRecipientSave(params, dispatch) {
    return new Promise((resolve, reject) => {
      dispatch({
        type: CustomerTypeAction.APIC_spCustomerRecipientSave,
        params,
        resolve,
        reject,
      });
    });
  }

  export function APIC_spCustomerComplain(params, dispatch) {
    return new Promise((resolve, reject) => {
      dispatch({
        type: CustomerTypeAction.APIC_spCustomerComplain,
        params,
        resolve,
        reject,
      });
    });
  }

  export function APIC_spCustomerComplainList(params, dispatch) {
    return new Promise((resolve, reject) => {
      dispatch({
        type: CustomerTypeAction.APIC_spCustomerComplainList,
        params,
        resolve,
        reject,
      });
    });
  }

  export function APIC_spCustomerOrderList(params, dispatch) {
    return new Promise((resolve, reject) => {
      dispatch({
        type: CustomerTypeAction.APIC_spCustomerOrderList,
        params,
        resolve,
        reject,
      });
    });
  }

  export function APIC_spCustomerOrderCreate(params, dispatch) {
    return new Promise((resolve, reject) => {
      dispatch({
        type: CustomerTypeAction.APIC_spCustomerOrderCreate,
        params,
        resolve,
        reject,
      });
    });
  }

  export function APIC_SendSMSOTP(params, dispatch) {
    return new Promise((resolve, reject) => {
      dispatch({
        type: CustomerTypeAction.APIC_SendSMSOTP,
        params,
        resolve,
        reject,
      });
    });
  }

  export function APIC_spCustomerVerification(params, dispatch) {
    return new Promise((resolve, reject) => {
      dispatch({
        type: CustomerTypeAction.APIC_spCustomerVerification,
        params,
        resolve,
        reject,
      });
    });
  }

  export function APIC_GetEncoding(params, dispatch) {
    return new Promise((resolve, reject) => {
      dispatch({
        type: CustomerTypeAction.APIC_GetEncoding,
        params,
        resolve,
        reject,
      });
    });
  }