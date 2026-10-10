const lengthInput = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");
const generateButton = document.getElementById("generate");
const generatedPassword = document.getElementById("generatedPassword");

const copyButton = document.getElementById("copy");
const generatorMessage = document.getElementById("generatorMessage");

const checkPassword = document.getElementById("checkPassword");
const toggleCheck = document.getElementById("toggleCheck");
const strength = document.getElementById("strength");
const strengthBar = document.getElementById("strengthBar");

const requirements = {
  length: document.getElementById("reqLength"),
  upper: document.getElementById("reqUpper"),
  lower: document.getElementById("reqLower"),
  number: document.getElementById("reqNumber"),
  symbol: document.getElementById("reqSymbol")
};

lengthInput.addEventListener("input", () => {
  lengthValue.textContent = lengthInput.value;
});

function secureRandom(max) {
  const values = new Uint32Array(1);
  const limit = Math.floor(4294967296 / max) * max;

  do {
    crypto.getRandomValues(values);
  } while (values[0] >= limit);

  return values[0] % max;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = secureRandom(i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

generateButton.addEventListener("click", () => {
  const groups = [];

  if (document.getElementById("uppercase").checked) {
    groups.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  }
  if (document.getElementById("lowercase").checked) {
    groups.push("abcdefghijklmnopqrstuvwxyz");
  }
  if (document.getElementById("numbers").checked) {
    groups.push("0123456789");
  }
  if (document.getElementById("symbols").checked) {
    groups.push("!@#$%^&*()-_=+?");
  }

  if (groups.length === 0) {
    generatorMessage.textContent = "Select at least one character type.";
    return;
  }

  const passwordLength = Number(lengthInput.value);

  if (passwordLength < groups.length) {
    generatorMessage.textContent =
      "Increase the length to include every selected character type.";
    return;
  }

  const characters = groups.map(group => group[secureRandom(group.length)]);

  const allCharacters = groups.join("");

  while (characters.length < passwordLength) {
    characters.push(allCharacters[secureRandom(allCharacters.length)]);
  }

  const password = shuffle(characters).join("");

  generatedPassword.value = password;
  
  generatorMessage.textContent = "Password generated successfully.";
  checkPassword.value = password;
  checkPassword.dispatchEvent(new Event("input"));
});


copyButton.addEventListener("click", async () => {
  if (!generatedPassword.value) {
    generatorMessage.textContent = "Generate a password first.";
    return;
  }

  try {
    await navigator.clipboard.writeText(generatedPassword.value);
    generatorMessage.textContent = "Password copied to clipboard.";
  } catch {
    generatorMessage.textContent =
      "Copy unavailable. Select and copy the password manually.";
  }
});

function checkStrength(password) {
  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password)
  };

  for (const key in checks) {
    requirements[key].classList.toggle("met", checks[key]);
  }

  const score = Object.values(checks).filter(Boolean).length;

  if (!password) {
    strength.textContent = "Not checked";
    strengthBar.style.width = "0%";
    return;
  }

  let label;

  if (score <= 2) {
    label = "Weak";
  } else if (score <= 4) {
    label = "Medium";
  } else {
    label = "Strong";
  }

  strength.textContent = label;
  strengthBar.style.width = `${score * 20}%`;
}

checkPassword.addEventListener("input", () => {
  checkStrength(checkPassword.value);
});

toggleCheck.addEventListener("click", () => {
  const hidden = checkPassword.type === "password";
  checkPassword.type = hidden ? "text" : "password";
  toggleCheck.textContent = hidden ? "Hide" : "Show";
});
