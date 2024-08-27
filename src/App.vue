<script setup>
import { ref, computed } from 'vue';
import NavButton from './assets/NavButton.vue';
import CopyIcon from './assets/CopyIcon.vue';
import ExclamationIcon from './assets/ExclamationIcon.vue';
import word from './data/words.json';

//----------------------------------------Variables----------------------------------------//
const options = [
  {
    label: 'Include Symbol',
    isChecked: ref(false),
    chars: '!@#$%^&*()',
  },
  {
    label: 'Include Numeric',
    isChecked: ref(false),
    chars: '0123456789',
  },
  {
    label: 'Include Lowercase',
    isChecked: ref(false),
    chars: 'abcdefghijklmnopqrstuvwxyz',
  },
  {
    label: 'Include Uppercase',
    isChecked: ref(false),
    chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  },
];

const strengthLevels = {
  0: 'Password Strength',
  1: 'Very Weak',
  2: 'Weak',
  3: 'Moderate',
  4: 'Strong',
  5: 'Very Strong',
  6: 'Excellent',
};

const passwordStrengthIndex = ref(0);

// generated password
const generatedPassword = ref(null);
// password length
const passwordLength = ref(8);

// password history
const passwordHistory = ref([]);

// status information
const buttonTrigger = ref(false);
const popupPassword = ref('');

// check error
const error = ref(false);
const validateError = ref(false);

//page switching variables
const switchPage = ref('PasswordGenerator');
//drawer
const isDrawer = ref(false);
// password validate variables
const enteredPassword = ref('');
const passwordValidateStrength = ref(strengthLevels[0]);
const strengthFeedback = ref([]);
const progressBackground = computed(() => {
  if (passwordStrengthIndex.value >= 4) return 'progress-success';
  if (passwordStrengthIndex.value > 2) return 'progress-warning';
  return 'progress-error';
});

//-----------------------------------------Generate-----------------------------------------//

const charset = computed(() => options.reduce((acc, option) => (option.isChecked.value ? acc + option.chars : acc), ''));

const selectedOptionsCount = computed(() => {
  let optionCount = options.filter((option) => option.isChecked.value).length;
  return passwordLength.value >= 12 ? optionCount + 1 : optionCount;
});

const passwordStrength = computed(() => {
  return strengthLevels[selectedOptionsCount.value];
});

const generatePassword = () => {
  const checkOptionSelect = options.some((option) => option.isChecked.value);
  // option validation
  if (!checkOptionSelect) {
    error.value = true;
    return;
  } else {
    error.value = false;
  }

  // begin to generate password
  let password = '';
  const charsetLength = charset.value.length;

  for (let i = 0; i < passwordLength.value; i++) {
    const randomIndex = Math.floor(Math.random() * charsetLength);
    password += charset.value.charAt(randomIndex);
  }

  generatedPassword.value = password;

  // push the generated password to passwordHistory array
  passwordHistory.value.push({
    password: password,
    length: passwordLength.value,
    strength: passwordStrength.value,
  });
};

//------------------------------------------Copy------------------------------------------//
async function copyPassword(text) {
  if (navigator.clipboard) {
    // set the clipboard
    await navigator.clipboard.writeText(text);
    popupPassword.value = text;

    // "alert" can be remove later 4s
    buttonTrigger.value = true;

    setTimeout(() => {
      buttonTrigger.value = false;
    }, 4000);
  }
}
//--------------------------------------validate-------------------------------------------//

const validateEnteredPassword = () => {
  if (enteredPassword.value === '') {
    passwordValidateStrength.value = strengthLevels[0];
    strengthFeedback.value = [];
    passwordStrengthIndex.value = 0;
    validateError.value = true;
    return;
  }
  validateError.value = false;
  const { strength, feedback } = validatePassword(enteredPassword.value);
  // Update the state variables
  passwordValidateStrength.value = strengthLevels[strength];
  passwordStrengthIndex.value = strength;

  strengthFeedback.value = feedback;
};

const validatePassword = (password) => {
  if (!password) return { strength: 0, feedback: [] };
  const requirements = [
    { regex: /[A-Z]/, message: "Password doesn't contain uppercase letters" },
    { regex: /[a-z]/, message: "Password doesn't contain lowercase letters" },
    { regex: /[0-9]/, message: "Password doesn't contain numbers" },
    { regex: /[!@#$%^&*()]/, message: "Password doesn't contain symbols" },
  ];

  const containCommonWord = () => {
    const lowerPassword = password.toLowerCase().trim();
    return word.some((word) => lowerPassword.includes(word) && word.length > 2);
  };

  const findMatchedWords = () => {
    const matchedPassword = [];
    const lowerPassword = password.toLowerCase().trim();

    word.forEach((word) => {
      if (lowerPassword.includes(word) && word.length > 2) {
        matchedPassword.push(word);
      }
    });
    return matchedPassword;
  };

  let strength = 0;
  const feedback = [];

  if (!containCommonWord()) {
    strength += 1;
  } else {
    feedback.push(`Your password contain "${findMatchedWords().join(', ')}" which is a common word`);
  }

  if (password.length >= 12) {
    strength += 1;
  } else {
    feedback.push('Password should be at least 12 characters long');
  }

  requirements.forEach((requirement) => {
    if (requirement.regex.test(password)) {
      strength += 1;
    } else {
      feedback.push(requirement.message);
    }
  });
  if (strength === 6) {
    feedback.push('Your password is strong. Good job!');
  }
  const maxStrength = Math.min(strength, 6);
  return { strength: maxStrength, feedback };
};

const theme = ref(localStorage.getItem('theme') || 'light');

const handleThemeChange = (e) => {
  // Update localStorage and theme reactive variable
  const newTheme = e.target.checked ? 'dark' : 'light';
  localStorage.setItem('theme', newTheme);
  theme.value = newTheme;
};

//------------------------------Drawer-------------------------------//
const Toggledrawer = () => {
  isDrawer.value = !isDrawer.value;
};
</script>
<template>
  <section :data-theme="theme">
    <!-- Popup copied to clipboard -->
    <Transition name="pop-up">
      <div v-show="buttonTrigger && passwordHistory.length !== 0" class="fixed sm:flex m-3 bottom-3 right-1 z-[999] hidden">
        <div class="flex items-center justify-center p-3 font-sans bg-green-600 rounded-lg shadow-md error w-50 opacity-80">
          <div class="text-base font-semibold text-white error__title">Password " {{ popupPassword }} " copied to clipboard</div>
          <div class="justify-center w-5 h-5 pl-2 ml-auto cursor-pointer error__close" @click="buttonTrigger = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 20 20" height="20">
              <path fill="#fff" d="m15.8333 5.34166-1.175-1.175-4.6583 4.65834-4.65833-4.65834-1.175 1.175 4.65833 4.65834-4.65833 4.6583 1.175 1.175 4.65833-4.6583 4.6583 4.6583 1.175-1.175-4.6583-4.6583z"></path>
            </svg>
          </div>
        </div>
      </div>
    </Transition>
    <div class="w-full min-h-screen pb-10 flex flex-col text-neutral pt-5 max-w-[30rem] mx-auto px-4 md:px-0 md:py-0">
      <nav>
        <div class="container flex items-center justify-between py-2 mx-auto mb-10">
          <div class="flex items-center justify-center">
            <a class="flex items-center text-2xl font-bold lg:text-4xl" href="#">SECURE </a>
            <svg class="ml-2" width="36" height="37" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M29.25 16.7656H11.6719V8.67188C11.6719 7.55537 12.5543 6.64844 13.6406 6.64844H22.3594C23.4457 6.64844 24.3281 7.55537 24.3281 8.67188V11.1289C24.3281 11.2879 24.4547 11.418 24.6094 11.418H26.5781C26.7328 11.418 26.8594 11.2879 26.8594 11.1289V8.67188C26.8594 6.11729 24.8449 4.04688 22.3594 4.04688H13.6406C11.1551 4.04688 9.14062 6.11729 9.14062 8.67188V16.7656H6.75C6.12773 16.7656 5.625 17.2823 5.625 17.9219V31.7969C5.625 32.4364 6.12773 32.9531 6.75 32.9531H29.25C29.8723 32.9531 30.375 32.4364 30.375 31.7969V17.9219C30.375 17.2823 29.8723 16.7656 29.25 16.7656ZM27.8438 30.3516H8.15625V19.3672H27.8438V30.3516ZM17.0156 25.3291V27.2441C17.0156 27.4031 17.1422 27.5332 17.2969 27.5332H18.7031C18.8578 27.5332 18.9844 27.4031 18.9844 27.2441V25.3291C19.2746 25.115 19.4912 24.8117 19.603 24.463C19.7149 24.1143 19.7161 23.7381 19.6067 23.3885C19.4973 23.039 19.2827 22.7342 18.994 22.518C18.7053 22.3017 18.3573 22.1852 18 22.1852C17.6427 22.1852 17.2947 22.3017 17.006 22.518C16.7173 22.7342 16.5027 23.039 16.3933 23.3885C16.2839 23.7381 16.2851 24.1143 16.397 24.463C16.5088 24.8117 16.7254 25.115 17.0156 25.3291Z"
                fill="#93C7E1"
              />
            </svg>
          </div>

          <div>
            <div class="drawer">
              <input id="my-drawer" type="checkbox" class="drawer-toggle" />
              <div class="flex drawer-content">
                <!-- Page content here -->
                <label class="swap swap-rotate">
                  <!-- this hidden checkbox controls the state -->
                  <input :checked="theme === 'dark'" type="checkbox" class="theme-controller" @click="handleThemeChange" />
                  <!-- sun icon -->
                  <svg class="h-10 fill-current swap-off w-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                  </svg>
                  <!-- moon icon -->
                  <svg class="h-10 fill-current swap-on w-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                  </svg>
                </label>

                <label @click="Toggledrawer" class="btn btn-square btn-ghost drawer-button">
                  <NavButton />
                </label>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <!-- tab -->
      <div role="tablist" class="mb-4 tabs tabs-boxed bg-accent">
        <a role="tab" class="transition-all duration-300 tab" :class="{ 'tab-active': switchPage === 'PasswordGenerator' }" @click="switchPage = 'PasswordGenerator'">Password Generator</a>
        <a role="tab" class="transition-all duration-300 tab" :class="{ 'tab-active': switchPage === 'PasswordValidate' }" @click="switchPage = 'PasswordValidate'">Password Checker</a>
      </div>

      <Transition>
        <section v-show="switchPage === 'PasswordGenerator'">
          <div class="flex items-center justify-between p-4 mb-5 bg-accent">
            <p v-if="generatedPassword" v-text="generatedPassword" class="text-3xl"></p>
            <p v-else class="text-3xl">P4SSWORD</p>
            <button @click="copyPassword(generatedPassword)">
              <div class="tooltip" data-tip="Copy to Clipboard">
                <CopyIcon />
              </div>
            </button>
          </div>
          <!-- Password Display -->
          <div class="flex flex-col gap-2 p-6 bg-accent">
            <div class="flex items-center text-3xl uppercase">
              <div class="z-0 tooltip color-tooltip" data-tip="Create a secure password for you">
                <ExclamationIcon />
              </div>
              <h1>Password Generator</h1>
            </div>
            <div class="form-control">
              <div class="flex items-center justify-between">
                <p>Password Length:</p>
                <h1 class="text-[30px] text-primary font-semibold">{{ passwordLength }}</h1>
              </div>
              <input type="range" min="8" max="20" v-model="passwordLength" class="block mb-2 text-sm font-medium text-gray-900 cursor-pointer dark:text-white" />
              <!-- Mapped Checkbox Component -->
              <div v-for="(option, index) in options" :key="index">
                <label class="cursor-pointer label justify-normal">
                  <input type="checkbox" class="checkbox checkbox-primary" v-model="option.isChecked.value" />
                  <span class="p-1">{{ option.label }}</span>
                </label>
              </div>
              <!-- Password Strength -->
              <p v-show="error" class="my-1 dark: text-error">Please select at least one option.</p>
              <div class="flex justify-between py-4 pl-2 mt-1 mb-3 bg-primary">
                <p class="text-[19px] ml-2 text-base-100">{{ passwordStrength }}</p>
                <div class="flex items-center">
                  <div v-for="index in 5" :key="index" class="h-full w-[12px] mr-3 flex bg-white" :class="{ '!bg-secondary': index <= selectedOptionsCount }"></div>
                </div>
              </div>
            </div>
            <button class="w-full btn btn-primary text-base-100" @click="generatePassword">Generate Password</button>
          </div>
        </section>
      </Transition>

      <!-- section 2 Password Validate-->
      <Transition>
        <section v-show="switchPage === 'PasswordValidate'">
          <!-- Input Password Strength Validate -->
          <div class="flex flex-col gap-2 p-6 mb-5 bg-accent">
            <div class="form-control">
              <input type="text" class="text-2xl input input-ghost focus:outline-0 focus-within:outline-0 focus:bg-transparent" placeholder="Enter your password" v-model="enteredPassword" />
            </div>
          </div>
          <!-- Lower Box -->
          <!-- Big PasswordValidate Zone-->
          <div class="flex flex-col gap-2 p-6 bg-accent">
            <div class="flex items-center text-3xl uppercase">
              <div class="z-0 tooltip tooltip-primary" data-tip="Check your password security">
                <ExclamationIcon />
              </div>
              <h1 class="text-3xl whitespace-nowrap">Password Checker</h1>
            </div>
            <!-- PasswordStrength Zone-->
            <div class="my-5">
              <h2 class="text-lg">Strength:</h2>
              <div>
                <h1 class="text-3xl font-semibold uppercase md:text-4xl whitespace-nowrap" v-text="passwordValidateStrength"></h1>
                <progress v-show="passwordStrengthIndex < 6" class="w-full progress" :class="progressBackground" :value="passwordStrengthIndex" max="6"></progress>
                <progress v-show="passwordStrengthIndex === 6" class="w-full progress bg-gradient-to-r from-[#F75DCC] via-[#8E40FF] to-[#4CDBEF]" :value="0" max="6"></progress>
              </div>
            </div>
            <!-- FeedBack Zone-->
            <div class="mb-5">
              <h2 class="text-lg font-bold">FeedBack:</h2>
              <div>
                <ul v-if="strengthFeedback.length > 0">
                  <li v-for="(message, index) in strengthFeedback" :key="index" class="my-1 list-disc list-inside text-base-content">{{ message }}</li>
                </ul>
                <li v-show="validateError" class="my-1 list-disc list-inside dark: text-error">Please entered the password to check.</li>
              </div>
            </div>
            <button class="w-full btn btn-primary text-base-100" @click="validateEnteredPassword">Check Password</button>
          </div>
        </section>
      </Transition>
    </div>
    <Transition name="drawer">
      <div class="fixed top-0 z-50 overflow-y-auto h-full w-auto bg-base-200 min-w-[25rem] p-5" v-show="isDrawer">
        <label for="my-drawer" class="drawer-overlay"></label>
        <ul class="w-auto min-h-full menu bg-base-200 text-base-content">
          <div class="flex items-center justify-between p-5">
            <h1 class="text-3xl text-center">History Password</h1>
            <button @click="Toggledrawer" class="btn btn-square btn-outline btn-error sm:btn-ghost">X</button>
          </div>
          <div>
            <table class="table w-full">
              <p v-show="passwordHistory.length === 0" class="pl-5 text-xl text-start">Your History is Empty!</p>
              <thead v-show="passwordHistory.length !== 0" class="text-[15px]">
                <tr>
                  <th>No.</th>
                  <th>Password</th>
                  <th>Length</th>
                  <th>Strength</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(entry, index) in passwordHistory" :key="index" @click="copyPassword(entry.password)" class="cursor-pointer hover:bg-base-300">
                  <td>{{ index + 1 }}</td>
                  <td>{{ entry.password }}</td>
                  <td>{{ entry.length }}</td>
                  <td>{{ entry.strength }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ul>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.color-tooltip {
  --tooltip-color: #ffffff;
  --tooltip-text-color: #51baee;
}

.drawer-enter-active {
  transform: translateX(0);
  transition: all 0.3s ease-in-out;
}

.drawer-leave-active {
  transform: translateX(-100%);
  transition: all 0.2s ease-in-out;
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(-100%);
}

.pop-up-enter-active {
  transform: translateY(0);
  transition: all 0.3s ease-out;
}

.pop-up-leave-active {
  transform: translateY(50px);
  transition: all 0.2s ease-in-out;
}

.pop-up-enter-from,
.pop-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.v-enter-active {
  transform: translateY(0);
  transition: all 0.3s ease-out;
}

.v-enter-from,
.v-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
