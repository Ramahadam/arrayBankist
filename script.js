'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2022-11-18T20:31:17.178Z',
    '2022-11-23T19:42:02.383Z',
    '2022-11-28T09:15:04.904Z',
    '2022-11-01T10:17:24.185Z',
    '2022-09-08T14:11:59.604Z',
    '2022-09-27T17:01:17.194Z',
    '2022-09-11T23:36:17.929Z',
    '2022-11-12T18:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Mohamed Adam',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 3333,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'SDG',
  locale: 'ar-SY',
};

const accounts = [account1, account2, account3];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatDate = function (date, locale) {
  const calcDdatePassed = (date1, date2) =>
    Math.trunc(Math.abs(date1 - date2) / (24 * 60 * 60 * 1000));

  const daysPassed = calcDdatePassed(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  if (daysPassed > 7) {
    // console.log(Math.trunc(daysPassed));
    // const day = date.getDate();
    // const month = date.getMonth();
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;

    return new Intl.DateTimeFormat(locale).format(date);
  }
};
const formatNumbers = function (acc, mov) {
  const options = {
    style: 'currency',
    currency: acc.currency,
  };
  const formatedNumber = new Intl.NumberFormat(acc.locale, options).format(
    mov.toFixed(2)
  );
  return formatedNumber;
};
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatDate(date, acc.locale);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type} </div> <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formatNumbers(acc, mov)}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatNumbers(acc, acc.balance);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatNumbers(acc, incomes);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatNumbers(acc, out);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
  labelSumInterest.textContent = formatNumbers(acc, interest);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  let time = 20;

  const timer = setInterval(function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);

    //In each calll print the remaining time
    labelTimer.textContent = ` ${min} : ${sec}`;

    //When 0 seconds print the minr
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }

    //Decrease timer
    time--;
  }, 1000);

  return timer;
};

//////////////////////////////////////
// Event handlers
let currentAccount, timer;
//Fake account
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

//Experminting APIS WITH DATE

const iban = '23784387483748787';
const ibanCoded = iban.slice(-4);
console.log(ibanCoded.padStart(iban.length, '*'));

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //Experminiting dates
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: '2-digit',
      year: 'numeric',
    };
    const locale = currentAccount.locale;
    labelDate.textContent = Intl.DateTimeFormat(locale, options).format(now);
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // startLogOutTimer();
    // Update UI
    updateUI(currentAccount);

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Adding dates to transfer amounts
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputLoanAmount.value;

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement amount
      currentAccount.movements.push(amount);

      // Add movement date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }, 5000);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
// console.log(1.2 + 0.2);
// console.log(1.1 + 1.2 - 1);
// console.log(0.1 + 0.2);

// // Type coversion
// console.log(Number('23'));
// console.log(+'23');
// console.log('23');

//Parsing number from string
// console.log(Number.parseInt('23$', 10));

// console.log(Number.parseFloat('2.3rem', 10));

// //isNaN
// console.log(Number.isNaN(20));
// console.log(Number.isNaN('20'));
// console.log(Number.isNaN('20X'));
// console.log(Number.isNaN(10 / 0));

//isFinite is better way to check if sth is a number or not (Be)
// console.log(Number.isFinite(10));
// console.log(Number.isFinite(10 / 0));
// console.log(Number.isFinite('20'));
// console.log(Math.sqrt(25));
//

const randomInt = (min, max) =>
  Math.trunc(Math.random() * (max - min) + 1) + min;

// console.log(randomInt(10, 20));
// console.log((2.34).toFixed());
// console.log((2.34).toFixed(2));
// console.log(+(2.34423).toFixed(3));

//Numiric seperator

const diameter = 356_98_000_000;
// console.log(diameter);
// const area = 43_99;
// console.log(area);

// const number1 = '249_98';
// console.log(Number(number1));
// console.log(parseInt(number1));

//Big int
// console.log(2 ** 53 - 1);
// console.log(2 ** 106 - 1);
// console.log(Number.MAX_SAFE_INTEGER * 2);
// console.log(88835832847591385488504903285257905297529);
// console.log(88835832847591385488504903285257905297529n);
// console.log(BigInt(888358328475913854885049032852579052497529));

//Creating Dates
// const now = new Date();
// console.log(now);
// console.log(new Date('September 16, 2022 6:43'));
// console.log(new Date(account1.movementsDates[0]));
// console.log(new Date(2022, 10, 30, 6, 18));
// console.log(new Date(2 * 4 * 24 * 60 * 60 * 1000));

//Working with dates
//when we convert date to number the result will be tmestamp and then we can run all math operations on it

const dateFuture = new Date(2022, 11, 30, 6, 23);
const dateNow = new Date(2022, 11, 20, 6, 23);

// const calcDdatePassed = (date1, date2) =>
//   Math.abs(date1 - date2) / (24 * 60 * 60 * 1000);

// console.log(datePassed(dateFuture, dateNow));

const num = 3232134.34;
const options = {
  style: 'currency',
  currency: 'SDG',
};
console.log(new Intl.NumberFormat('en-US', options).format(num));
console.log(new Intl.NumberFormat('de-DE', options).format(num));
console.log(new Intl.NumberFormat('ar-SY', options).format(num));

const food = ['assid', 'kissra', 'tagalia'];
const orderFood = setTimeout(
  (asida, kissra) => console.log(`'Your food includes '${asida} ${kissra}`),
  3000,
  ...food
);
console.log('waiting.....');

if (food.includes('assid')) clearTimeout(orderFood);

function print() {
  console.log(myName);
}
let myName = 'Mohamed';

print();
