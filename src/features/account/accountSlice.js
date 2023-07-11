import { createSlice } from '@reduxjs/toolkit';

//Set initial state
const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: '',
  isLoading: false,
};

//We create the slice. It accepts an object containing, the name of the slice, the initial state and the reducers (1 for each action)
const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    deposit(state, action) {
      state.balance += action.payload;
      state.isLoading = false;
    },
    withdraw(state, action) {
      state.balance -= action.payload;
    },
    requestLoan: {
      //We need to use the prepare and this technique if we want to use multiple values in the payload
      prepare(amount, purpose) {
        return { payload: { amount, purpose } };
      },
      reducer(state, action) {
        if (state.loan > 0) return;

        state.loan = action.payload.amount;
        state.loanPurpose = action.payload.purpose;
        state.balance = state.balance + action.payload.amount;
      },
    },
    payLoan(state) {
      state.balance -= state.loan;
      state.loan = 0;
      state.loanPurpose = '';
    },
    convertingCurrency(state) {
      state.isLoading = true;
    },
  },
});

export const { withdraw, requestLoan, payLoan } = accountSlice.actions;

export const deposit = (amount, currency) => {
  if (currency === 'USD') return { type: 'account/deposit', payload: amount };

  //If we return a function, REDUX know that this is the async operation in the middleware
  return async (dispatch, getState) => {
    //API call
    dispatch({ type: 'account/convertingCurrency' });
    const res = await fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`
    );
    const data = await res.json();
    const amountInUSD = data.rates.USD;
    // return action
    dispatch({ type: 'account/deposit', payload: amountInUSD });
  };
};

export default accountSlice.reducer;

// export const accountReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case 'account/deposit':
//       return {
//         ...state,
//         balance: state.balance + action.payload,
//         isLoading: false,
//       };
//     case 'account/withdraw':
//       return {
//         ...state,
//         balance: state.balance - action.payload,
//       };
//     case 'account/requestLoan':
//       if (state.loan > 0) return state;
//       return {
//         ...state,
//         balance: state.balance + action.payload.amount,
//         loan: action.payload.amount,
//         loanPurpose: action.payload.purpose,
//       };
//     case 'account/payLoan':
//       return {
//         ...state,
//         loan: 0,
//         loanPurpose: '',
//         balance: state.balance - state.loan,
//       };
//     case 'acccount/convertingCurrency':
//       return {
//         ...state,
//         isLoading: true,
//       };

//     default:
//       return state;
//   }
// };

// export const deposit = (amount, currency) => {
//   if (currency === 'USD') return { type: 'account/deposit', payload: amount };

//   //If we return a function, REDUX know that this is the async operation in the middleware
//   return async (dispatch, getState) => {
//     //API call
//     dispatch({ type: 'account/convertingCurrency' });
//     const res = await fetch(
//       `https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`
//     );
//     const data = await res.json();
//     const amountInUSD = data.rates.USD;
//     // return action
//     dispatch({ type: 'account/deposit', payload: amountInUSD });
//   };
// };

// export const withdraw = amount => {
//   return { type: 'account/withdraw', payload: amount };
// };

// export const requestLoan = (amount, purpose) => {
//   return {
//     type: 'account/requestLoan',
//     payload: { amount: amount, purpose: purpose },
//   };
// };
// export const payLoan = () => {
//   return { type: 'account/payLoan' };
// };
