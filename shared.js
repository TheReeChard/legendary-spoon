// ========================================
// PlayWard - Shared JavaScript
// State management via localStorage
// ========================================

// ========================================
// Application State Management
// ========================================
const defaultAppData = {
  activityType: "",
  themeType: "",
  theme: "",
  customTheme: "",
  themeFocus: "",
  themeCharacter: "",
  ageRange: "",
  diversity: "",
  medicalConsiderations: [],
  customization: {},
};

// Load state from localStorage
function loadAppData() {
  const stored = localStorage.getItem("playwardData");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error loading app data:", e);
      return { ...defaultAppData };
    }
  }
  return { ...defaultAppData };
}

// Save state to localStorage
function saveAppData(data) {
  localStorage.setItem("playwardData", JSON.stringify(data));
}

// Get current app data
let appData = loadAppData();

// Reset all data
function resetAppData() {
  appData = { ...defaultAppData };
  saveAppData(appData);
}

// ========================================
// Activity Configuration
// ========================================
const activityConfig = {
  coloring: {
    name: "Coloring Page",
    icon: "images/coloringpage.png",
    color: "#e8f5e9",
  },
  trivia: {
    name: "Trivia",
    icon: "images/trivia.png",
    color: "#fff3e0",
  },
  "hidden-objects": {
    name: "Hidden Objects",
    icon: "images/hiddenobject.png",
    color: "#e3f2fd",
  },
  story: {
    name: "Short Story",
    icon: "images/shortstory.png",
    color: "#fce4ec",
  },
  "activity-game": {
    name: "Game",
    icon: "images/activity.png",
    color: "#f3e5f5",
  },
};

// Medical icons mapping
const medicalIcons = {
  wheelchair: "images/wheelchair.png",
  syringe: "images/syringe.png",
  anxiety: "images/anxiety.png",
  surgery: "images/surgery.png",
  cast: "images/cast.png",
  pain: "images/pain.png",
};

// ========================================
// Navigation
// ========================================
function goToPage(pageName) {
  window.location.href = pageName;
}

// ========================================
// Prompt Templates
// ========================================
const promptTemplates = {
  coloring: `Create a personalized, printable PDF coloring page for a {AGE_GROUP} year old child with the theme of {THEME}.

Activity Requirements:
- Page Type: Standard Coloring Page
- Complexity / Age Level: {DIFFICULTY}
- Art Style: {ART_STYLE}
- Theme or Character: {CHARACTER_INFO}

Personalization:
{NICKNAME_LINE}- Medical Context: {MEDICAL_CONTEXT}

{DIVERSITY_REQUIREMENTS}

The page should be a standard coloring page with medium complexity and bold cartoon lines. The main character should be a kid superhero flying over the city.{NICKNAME_INSTRUCTION} Include action stars, clouds, and motion lines throughout the scene. The overall feeling should highlight strength and confidence.{NICKNAME_TEXT_INSTRUCTION}`,

  trivia: `Create a personalized trivia game for a {AGE_GROUP} year old child with the theme of {THEME}.

Activity Requirements:
- Game Style: {GAME_STYLE}
- Question Count: {QUESTION_COUNT}
- Story Complexity: {STORY_COMPLEXITY}
- Theme or Character: {CHARACTER_INFO}

Personalization:
{NICKNAME_LINE}- Medical Context: {MEDICAL_CONTEXT}

{DIVERSITY_REQUIREMENTS}

Create engaging, age-appropriate trivia questions that are fun and educational. Include interesting facts and explanations with each answer.{NICKNAME_INSTRUCTION}`,

  "hidden-objects": `Create a personalized hidden objects activity for a {AGE_GROUP} year old child with the theme of {THEME}.

Activity Requirements:
- Page Type: Hidden Objects Activity
- Complexity / Age Level: {DIFFICULTY}
- Art Style: {ART_STYLE}
- Theme or Character: {CHARACTER_INFO}
- Objects to Include: {OBJECTS_TO_INCLUDE}

Personalization:
{NICKNAME_LINE}- Medical Context: {MEDICAL_CONTEXT}

{DIVERSITY_REQUIREMENTS}

Create a detailed scene with hidden objects that are challenging but findable. Include a checklist of items to find.{NICKNAME_INSTRUCTION}`,

  story: `Create a personalized short story for a {AGE_GROUP} year old child with the theme of {THEME}.

Activity Requirements:
- Story Style: {STORY_STYLE}
- Story Setting: {STORY_SETTING}
- Story Genre: {STORY_GENRE}
- Story Complexity: {STORY_COMPLEXITY}
- Writing Style: {WRITING_STYLE}
- Theme or Character: {CHARACTER_INFO}

Personalization:
{NICKNAME_LINE}- Medical Context: {MEDICAL_CONTEXT}

{DIVERSITY_REQUIREMENTS}

Create an engaging, age-appropriate story with relatable characters and positive messages.{NICKNAME_INSTRUCTION}`,

  "activity-game": `Create a personalized activity game for a {AGE_GROUP} year old child with the theme of {THEME}.

Activity Requirements:
- Activity Location: {ACTIVITY_LOCATION}
- Number of Participants: {NUM_PARTICIPANTS}
- Specific Restrictions: {RESTRICTIONS}
- Theme or Character: {CHARACTER_INFO}

Personalization:
{NICKNAME_LINE}- Medical Context: {MEDICAL_CONTEXT}

{DIVERSITY_REQUIREMENTS}

Create clear game instructions with variations for different skill levels. The activity should be achievable and provide positive engagement.{NICKNAME_INSTRUCTION}`,
};

// ========================================
// Helper Functions
// ========================================
function formatTheme(theme) {
  if (!theme) return "Superheroes Adventure";
  return theme.charAt(0).toUpperCase() + theme.slice(1).replace("-", " ");
}

function getDifficulty() {
  const age = appData.ageRange;
  if (age === "3-5") return "Very Easy";
  if (age === "6-8") return "Easy";
  if (age === "9-11") return "Medium";
  if (age === "12-14") return "Medium-Hard";
  if (age === "15-18") return "Hard";
  return "Medium";
}

function formatMedicalContext() {
  if (appData.medicalConsiderations.length === 0) {
    return "";
  }
  return appData.medicalConsiderations
    .map((m) => {
      const names = {
        wheelchair: "Wheelchair",
        syringe: "IV/Injections",
        anxiety: "Anxiety",
        surgery: "Surgery",
        cast: "Cast",
        pain: "Pain",
      };
      return names[m] || m;
    })
    .join(", ");
}

function formatDiversityShort() {
  const names = {
    multicultural: "Multicultural",
    "gender-inclusive": "Gender-inclusive",
    accessibility: "Visual accessibility",
    language: "Simplified language",
  };
  return names[appData.diversity] || appData.diversity;
}

function formatDiversityRequirements() {
  if (!appData.diversity) {
    return "";
  }
  switch (appData.diversity) {
    case "multicultural":
      return "Include diverse cultural representations and backgrounds.";
    case "gender-inclusive":
      return "Use gender-inclusive language and diverse character representations.";
    case "accessibility":
      return "Ensure visual accessibility with high contrast, clear images, and large text.";
    case "language":
      return "Use simplified language appropriate for ESL learners.";
    default:
      return "";
  }
}

// ========================================
// Dynamic Sidebar Generation
// ========================================
function generateSidebar(currentPage) {
  const sidebarContainer = document.getElementById("dynamic-sidebar");
  if (!sidebarContainer) return;

  const activity = activityConfig[appData.activityType];

  if (!activity) {
    sidebarContainer.innerHTML = `
      <div class="sidebar-item" onclick="goToPage('activity-select.html')">
        <div class="sidebar-icon-bg rectangle">
          <img src="images/coloringpage.png" alt="Select Activity">
        </div>
        <span>Select Activity</span>
      </div>
    `;
    return;
  }

  let html = "";

  // Activity (always show selected activity) - rounded rectangle
  html += `
    <div class="sidebar-item ${currentPage === "activity-select" ? "active" : ""}" onclick="goToPage('activity-select.html')" title="Change Activity">
      <div class="sidebar-icon-bg rectangle">
        <img src="${activity.icon}" alt="${activity.name}">
      </div>
      <span>${activity.name}</span>
    </div>
  `;

  // Theme (if set) - rounded square
  if (appData.theme || appData.customTheme) {
    const themeName = appData.customTheme || formatTheme(appData.theme);
    const themeIcon =
      appData.themeType === "custom"
        ? "images/customtheme.png"
        : "images/defaulttheme.png";
    html += `
      <div class="sidebar-item ${currentPage === "default-themes" || currentPage === "custom-theme" || currentPage === "theme-type" ? "active" : ""}" onclick="goToPage('theme-type.html')" title="Change Theme">
        <div class="sidebar-icon-bg square">
          <img src="${themeIcon}" alt="Theme">
        </div>
        <span>${themeName}</span>
      </div>
    `;
  }

  // Medical/Personalization indicator - rotated diamond
  if (
    appData.medicalConsiderations.length > 0 ||
    appData.ageRange ||
    appData.diversity
  ) {
    let medicalIcon;
    let medicalLabel;

    if (appData.medicalConsiderations.length > 1) {
      medicalIcon = "images/Multislect.png";
      medicalLabel = "Multiple";
    } else if (appData.medicalConsiderations.length === 1) {
      const singleMedical = appData.medicalConsiderations[0];
      medicalIcon = medicalIcons[singleMedical] || "images/girl1.png";
      medicalLabel =
        singleMedical.charAt(0).toUpperCase() + singleMedical.slice(1);
    } else {
      medicalIcon = "images/girl1.png";
      medicalLabel = "Personal";
    }

    html += `
      <div class="sidebar-item ${currentPage === "personalization" ? "active" : ""}" onclick="goToPage('personalization.html')" title="Edit Personalization">
        <div class="sidebar-icon-bg diamond">
          <img src="${medicalIcon}" alt="Personalization">
        </div>
        <span>${medicalLabel}</span>
      </div>
    `;
  }

  // Customization indicator - show what they selected
  if (Object.keys(appData.customization).length > 0) {
    let customIcon = "images/girl2.png";
    let customLabel = "Custom";

    // For coloring and hidden-objects, show the art style they selected
    if (appData.customization.artStyle) {
      const artStyleIcons = {
        "3d-rendering": "images/3drender.png",
        "comic-book": "images/ComicBook.png",
        geometric: "images/geometric.png",
        anime: "images/Anime.png",
        realistic: "images/Realistic.png",
        drawing: "images/drawing.png",
      };
      customIcon = artStyleIcons[appData.customization.artStyle] || customIcon;
      customLabel =
        appData.customization.artStyle.charAt(0).toUpperCase() +
        appData.customization.artStyle.slice(1).replace("-", " ");
    }
    // For trivia, show game style
    else if (appData.customization["game-style"]) {
      customLabel = appData.customization["game-style"].replace("-", " ");
      customLabel = customLabel.charAt(0).toUpperCase() + customLabel.slice(1);
    }
    // For story, show story style
    else if (appData.customization["story-style"]) {
      customLabel =
        appData.customization["story-style"].charAt(0).toUpperCase() +
        appData.customization["story-style"].slice(1);
    }
    // For activity-game, show location
    else if (appData.customization["activity-location"]) {
      customLabel =
        appData.customization["activity-location"].charAt(0).toUpperCase() +
        appData.customization["activity-location"].slice(1);
    }

    html += `
      <div class="sidebar-item ${currentPage === "customization" ? "active" : ""}" onclick="goToPage('customization.html')" title="Edit Customization">
        <div class="sidebar-icon-bg pentagon">
          <img src="${customIcon}" alt="Customization">
        </div>
        <span>${customLabel}</span>
      </div>
    `;
  }

  sidebarContainer.innerHTML = html;
}

// ========================================
// Breadcrumb Navigation
// ========================================
// Page to step mapping
const pageToStep = {
  "theme-type": 0,
  "default-themes": 1,
  "custom-theme": 1,
  personalization: 2,
  customization: 3,
  review: 4,
  final: 5,
};

// Runner images for each step
const stepRunnerImages = {
  0: "images/girl1.png",
  1: "images/girl2.png",
  2: "images/girl2.png",
  3: "images/girl2.png",
  4: "images/girl3.png",
  5: "images/girl4.png",
};

function generateBreadcrumb(currentPage) {
  const breadcrumbContainer = document.getElementById("progress-breadcrumb");
  if (!breadcrumbContainer) return;

  const currentStep = pageToStep[currentPage] ?? 0;
  const totalSteps = 6;

  // Determine which steps are completed based on app state
  const completedSteps = getCompletedSteps();

  // Calculate progress percentage for the runner position
  const progressPercent = (currentStep / (totalSteps - 1)) * 100;

  // Calculate fill width
  const fillPercent =
    currentStep > 0 ? (currentStep / (totalSteps - 1)) * 100 : 0;

  let dotsHtml = "";

  for (let i = 0; i < totalSteps; i++) {
    const isActive = i === currentStep;
    const isCompleted = completedSteps.includes(i) || i < currentStep;
    const isClickable = isCompleted || i <= currentStep;

    dotsHtml += `
      <div class="progress-dot ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""} ${!isClickable ? "disabled" : ""}" 
           onclick="${isClickable ? `navigateToStep(${i})` : ""}" 
           title="Step ${i + 1}">
      </div>
    `;
  }

  // Get the appropriate runner image for this step
  const runnerImage = stepRunnerImages[currentStep] || "images/girl1.png";

  breadcrumbContainer.innerHTML = `
    <div class="progress-track">
      <div class="progress-line"></div>
      <div class="progress-line-fill" style="width: calc(${fillPercent}% - 30px);"></div>
      <div class="progress-dots">
        ${dotsHtml}
      </div>
      <img src="${runnerImage}" alt="Progress" class="progress-runner" style="left: calc(${progressPercent}% + 0px);">
    </div>
  `;
}

function getCompletedSteps() {
  const completed = [];

  // Step 0: Theme type selected
  if (appData.themeType) {
    completed.push(0);
  }

  // Step 1: Theme selected
  if (appData.theme || appData.customTheme) {
    completed.push(1);
  }

  // Step 2: Personalization
  if (
    appData.ageRange ||
    appData.diversity ||
    appData.medicalConsiderations.length > 0
  ) {
    completed.push(2);
  }

  // Step 3: Customization
  if (Object.keys(appData.customization).length > 0) {
    completed.push(3);
  }

  // Step 4 & 5 are completed when visited
  return completed;
}

function navigateToStep(step) {
  switch (step) {
    case 0:
      goToPage("theme-type.html");
      break;
    case 1:
      if (appData.themeType === "custom") {
        goToPage("custom-theme.html");
      } else {
        goToPage("default-themes.html");
      }
      break;
    case 2:
      goToPage("personalization.html");
      break;
    case 3:
      goToPage("customization.html");
      break;
    case 4:
      goToPage("review.html");
      break;
    case 5:
      goToPage("final.html");
      break;
  }
}

// ========================================
// Generate Final Prompt
// ========================================
function generatePrompt() {
  const template = promptTemplates[appData.activityType];
  if (!template) return "";

  let prompt = template;

  const themeToUse = appData.customTheme || formatTheme(appData.theme);
  const nickname = appData.customization["child-nickname"] || "";

  // Conditional nickname content
  const nicknameLineText = nickname ? `- Child's Nickname: ${nickname}\n` : "";
  const nicknameInstruction = nickname
    ? ` Personalize the content by using the child's nickname "${nickname}".`
    : "";
  const nicknameTextInstruction = nickname
    ? ` Add the optional text "Super ${nickname} Saves the Day!" on the page.`
    : "";

  const replacements = {
    "{AGE_GROUP}": appData.ageRange || "",
    "{THEME}": themeToUse || "",
    "{CHARACTER_INFO}": appData.themeCharacter || "",
    "{MEDICAL_CONTEXT}": formatMedicalContext(),
    "{DIVERSITY_REQUIREMENTS}": formatDiversityRequirements(),
    "{DIFFICULTY}": getDifficulty(),
    "{ART_STYLE}": appData.customization.artStyle || "",
    "{NICKNAME_LINE}": nicknameLineText,
    "{NICKNAME_INSTRUCTION}": nicknameInstruction,
    "{NICKNAME_TEXT_INSTRUCTION}": nicknameTextInstruction,
    "{GAME_STYLE}": appData.customization["game-style"] || "",
    "{QUESTION_COUNT}": appData.customization["question-count"] || "",
    "{STORY_COMPLEXITY}": appData.customization["story-complexity"] || "",
    "{STORY_STYLE}": appData.customization["story-style"] || "",
    "{STORY_SETTING}": appData.customization["story-setting"] || "",
    "{STORY_GENRE}": appData.customization["story-genre"] || "",
    "{WRITING_STYLE}": appData.customization["writing-style"] || "",
    "{OBJECTS_TO_INCLUDE}": appData.customization["objects-include"] || "",
    "{ACTIVITY_LOCATION}": appData.customization["activity-location"] || "",
    "{NUM_PARTICIPANTS}": appData.customization["num-participants"] || "",
    "{RESTRICTIONS}": appData.customization["restrictions"] || "",
  };

  for (const [key, value] of Object.entries(replacements)) {
    prompt = prompt.replace(
      new RegExp(key.replace(/[{}]/g, "\\$&"), "g"),
      value,
    );
  }

  return prompt;
}

// ========================================
// Copy to Clipboard
// ========================================
function copyPrompt() {
  const promptElement = document.getElementById("generated-prompt");
  if (!promptElement) return;

  const promptText = promptElement.textContent;
  navigator.clipboard
    .writeText(promptText)
    .then(() => {
      showNotification("Prompt copied to clipboard!");
    })
    .catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = promptText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      showNotification("Prompt copied to clipboard!");
    });
}

// ========================================
// Open in AI Platform
// ========================================
function openInAI(platform) {
  const promptElement = document.getElementById("generated-prompt");
  if (!promptElement) return;

  const promptText = promptElement.textContent;

  navigator.clipboard.writeText(promptText).then(() => {
    let url = "";
    switch (platform) {
      case "chatgpt":
        url = "https://chat.openai.com/";
        break;
      case "gemini":
        url = "https://gemini.google.com/app";
        break;
      case "claude":
        url = "https://claude.ai/new";
        break;
    }

    window.open(url, "_blank");
    showNotification(`Prompt copied! Opening ${platform}...`);
  });
}

// ========================================
// Show Notification
// ========================================
function showNotification(message) {
  const notification = document.getElementById("copy-notification");
  if (!notification) return;

  notification.textContent = message;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

// ========================================
// Activity Customization Content Generation
// ========================================
function getCustomizationContent() {
  const activityType = appData.activityType;

  switch (activityType) {
    case "coloring":
      return getColoringCustomization();
    case "trivia":
      return getTriviaCustomization();
    case "hidden-objects":
      return getHiddenObjectsCustomization();
    case "story":
      return getStoryCustomization();
    case "activity-game":
      return getActivityGameCustomization();
    default:
      return "<p>Please select an activity type first.</p>";
  }
}

function getColoringCustomization() {
  return `
    <div class="art-style-grid">
      <div class="art-style-item ${appData.customization.artStyle === "3d-rendering" ? "selected" : ""}" data-style="3d-rendering" onclick="selectArtStyle('3d-rendering')">
        <div class="art-style-box">
          <img src="images/3drender.png" alt="3D Rendering">
        </div>
        <span class="art-style-label">3D Rendering</span>
      </div>
      <div class="art-style-item ${appData.customization.artStyle === "comic-book" ? "selected" : ""}" data-style="comic-book" onclick="selectArtStyle('comic-book')">
        <div class="art-style-box">
          <img src="images/ComicBook.png" alt="Comic Book">
        </div>
        <span class="art-style-label">Comic Book</span>
      </div>
      <div class="art-style-item ${appData.customization.artStyle === "geometric" ? "selected" : ""}" data-style="geometric" onclick="selectArtStyle('geometric')">
        <div class="art-style-box">
          <img src="images/geometric.png" alt="Geometric">
        </div>
        <span class="art-style-label">Geometric</span>
      </div>
      <div class="art-style-item ${appData.customization.artStyle === "anime" ? "selected" : ""}" data-style="anime" onclick="selectArtStyle('anime')">
        <div class="art-style-box">
          <img src="images/Anime.png" alt="Anime">
        </div>
        <span class="art-style-label">Anime</span>
      </div>
      <div class="art-style-item ${appData.customization.artStyle === "realistic" ? "selected" : ""}" data-style="realistic" onclick="selectArtStyle('realistic')">
        <div class="art-style-box">
          <img src="images/Realistic.png" alt="Realistic">
        </div>
        <span class="art-style-label">Realistic</span>
      </div>
      <div class="art-style-item ${appData.customization.artStyle === "drawing" ? "selected" : ""}" data-style="drawing" onclick="selectArtStyle('drawing')">
        <div class="art-style-box">
          <img src="images/drawing.png" alt="Drawing">
        </div>
        <span class="art-style-label">Drawing</span>
      </div>
    </div>
    <div class="form-actions right">
      <button class="btn btn-primary" onclick="saveCustomization()">Next</button>
    </div>
  `;
}

function getTriviaCustomization() {
  return `
    <div class="dropdowns-grid">
      <div class="form-group">
        <label>Game Style <i class="fa-solid fa-circle-info info-tooltip"></i></label>
        <select id="game-style">
          <option value="">Select...</option>
          <option value="multiple-choice" ${appData.customization["game-style"] === "multiple-choice" ? "selected" : ""}>Multiple Choice</option>
          <option value="true-false" ${appData.customization["game-style"] === "true-false" ? "selected" : ""}>True/False</option>
          <option value="fill-blank" ${appData.customization["game-style"] === "fill-blank" ? "selected" : ""}>Fill in the Blank</option>
        </select>
      </div>
      <div class="form-group">
        <label>Question Count <i class="fa-solid fa-circle-info info-tooltip"></i></label>
        <select id="question-count">
          <option value="">Select...</option>
          <option value="5" ${appData.customization["question-count"] === "5" ? "selected" : ""}>5 Questions</option>
          <option value="10" ${appData.customization["question-count"] === "10" ? "selected" : ""}>10 Questions</option>
          <option value="15" ${appData.customization["question-count"] === "15" ? "selected" : ""}>15 Questions</option>
        </select>
      </div>
      <div class="form-group">
        <label>Story Complexity <i class="fa-solid fa-circle-info info-tooltip"></i></label>
        <select id="story-complexity">
          <option value="">Select...</option>
          <option value="easy" ${appData.customization["story-complexity"] === "easy" ? "selected" : ""}>Easy</option>
          <option value="medium" ${appData.customization["story-complexity"] === "medium" ? "selected" : ""}>Medium</option>
          <option value="hard" ${appData.customization["story-complexity"] === "hard" ? "selected" : ""}>Hard</option>
        </select>
      </div>
      <div class="form-group">
        <label>Child's Nickname <i class="fa-solid fa-circle-info info-tooltip"></i></label>
        <input type="text" id="child-nickname" placeholder="" value="${appData.customization["child-nickname"] || ""}">
      </div>
    </div>
    <div class="form-actions right">
      <button class="btn btn-primary" onclick="saveCustomization()">Next</button>
    </div>
  `;
}

function getHiddenObjectsCustomization() {
  return `
    <div class="art-style-grid">
      <div class="art-style-item ${appData.customization.artStyle === "3d-rendering" ? "selected" : ""}" data-style="3d-rendering" onclick="selectArtStyle('3d-rendering')">
        <div class="art-style-box">
          <img src="images/3drender.png" alt="3D Rendering">
        </div>
        <span class="art-style-label">3D Rendering</span>
      </div>
      <div class="art-style-item ${appData.customization.artStyle === "comic-book" ? "selected" : ""}" data-style="comic-book" onclick="selectArtStyle('comic-book')">
        <div class="art-style-box">
          <img src="images/ComicBook.png" alt="Comic Book">
        </div>
        <span class="art-style-label">Comic Book</span>
      </div>
      <div class="art-style-item ${appData.customization.artStyle === "geometric" ? "selected" : ""}" data-style="geometric" onclick="selectArtStyle('geometric')">
        <div class="art-style-box">
          <img src="images/geometric.png" alt="Geometric">
        </div>
        <span class="art-style-label">Geometric</span>
      </div>
      <div class="art-style-item ${appData.customization.artStyle === "anime" ? "selected" : ""}" data-style="anime" onclick="selectArtStyle('anime')">
        <div class="art-style-box">
          <img src="images/Anime.png" alt="Anime">
        </div>
        <span class="art-style-label">Anime</span>
      </div>
      <div class="art-style-item ${appData.customization.artStyle === "realistic" ? "selected" : ""}" data-style="realistic" onclick="selectArtStyle('realistic')">
        <div class="art-style-box">
          <img src="images/Realistic.png" alt="Realistic">
        </div>
        <span class="art-style-label">Realistic</span>
      </div>
      <div class="art-style-item ${appData.customization.artStyle === "drawing" ? "selected" : ""}" data-style="drawing" onclick="selectArtStyle('drawing')">
        <div class="art-style-box">
          <img src="images/drawing.png" alt="Drawing">
        </div>
        <span class="art-style-label">Drawing</span>
      </div>
    </div>
    <div class="form-group">
      <label>Objects to Include <i class="fa-solid fa-circle-info info-tooltip"></i></label>
      <input type="text" id="objects-include" placeholder="Enter any specific objects you want to be included" value="${appData.customization["objects-include"] || ""}">
    </div>
    <div class="form-actions right">
      <button class="btn btn-primary" onclick="saveCustomization()">Next</button>
    </div>
  `;
}

function getStoryCustomization() {
  return `
    <div class="dropdowns-grid">
      <div class="form-group">
        <label>Story Style <i class="fa-solid fa-circle-info info-tooltip"></i></label>
        <select id="story-style">
          <option value="">Select...</option>
          <option value="adventure" ${appData.customization["story-style"] === "adventure" ? "selected" : ""}>Adventure</option>
          <option value="fantasy" ${appData.customization["story-style"] === "fantasy" ? "selected" : ""}>Fantasy</option>
          <option value="educational" ${appData.customization["story-style"] === "educational" ? "selected" : ""}>Educational</option>
        </select>
      </div>
      <div class="form-group">
        <label>Story Setting <i class="fa-solid fa-circle-info info-tooltip"></i></label>
        <select id="story-setting">
          <option value="">Select...</option>
          <option value="forest" ${appData.customization["story-setting"] === "forest" ? "selected" : ""}>Forest</option>
          <option value="city" ${appData.customization["story-setting"] === "city" ? "selected" : ""}>City</option>
          <option value="space" ${appData.customization["story-setting"] === "space" ? "selected" : ""}>Space</option>
          <option value="ocean" ${appData.customization["story-setting"] === "ocean" ? "selected" : ""}>Ocean</option>
        </select>
      </div>
      <div class="form-group">
        <label>Story Genre <i class="fa-solid fa-circle-info info-tooltip"></i></label>
        <select id="story-genre">
          <option value="">Select...</option>
          <option value="comedy" ${appData.customization["story-genre"] === "comedy" ? "selected" : ""}>Comedy</option>
          <option value="mystery" ${appData.customization["story-genre"] === "mystery" ? "selected" : ""}>Mystery</option>
          <option value="action" ${appData.customization["story-genre"] === "action" ? "selected" : ""}>Action</option>
        </select>
      </div>
      <div class="form-group">
        <label>Story Complexity <i class="fa-solid fa-circle-info info-tooltip"></i></label>
        <select id="story-complexity">
          <option value="">Select...</option>
          <option value="simple" ${appData.customization["story-complexity"] === "simple" ? "selected" : ""}>Simple</option>
          <option value="medium" ${appData.customization["story-complexity"] === "medium" ? "selected" : ""}>Medium</option>
          <option value="complex" ${appData.customization["story-complexity"] === "complex" ? "selected" : ""}>Complex</option>
        </select>
      </div>
      <div class="form-group">
        <label>Writing Style <i class="fa-solid fa-circle-info info-tooltip"></i></label>
        <select id="writing-style">
          <option value="">Select...</option>
          <option value="playful" ${appData.customization["writing-style"] === "playful" ? "selected" : ""}>Playful</option>
          <option value="descriptive" ${appData.customization["writing-style"] === "descriptive" ? "selected" : ""}>Descriptive</option>
          <option value="simple" ${appData.customization["writing-style"] === "simple" ? "selected" : ""}>Simple</option>
        </select>
      </div>
      <div class="form-group">
        <label>Child's Nickname <i class="fa-solid fa-circle-info info-tooltip"></i></label>
        <input type="text" id="child-nickname" placeholder="" value="${appData.customization["child-nickname"] || ""}">
      </div>
    </div>
    <div class="form-actions right">
      <button class="btn btn-primary" onclick="saveCustomization()">Next</button>
    </div>
  `;
}

function getActivityGameCustomization() {
  return `
    <div class="form-group">
      <label>Activity Location</label>
      <span class="hint">Example: bedroom, floor, wheelchair, etc.</span>
      <input type="text" id="activity-location" placeholder="" value="${appData.customization["activity-location"] || ""}">
    </div>
    <div class="form-group">
      <label>Number of Participants</label>
      <span class="hint">The number of individuals participating in the activity</span>
      <input type="text" id="num-participants" placeholder="" value="${appData.customization["num-participants"] || ""}">
    </div>
    <div class="form-group">
      <label>Specific Restrictions</label>
      <span class="hint">Example: low mobility, limited dexterity, bed rest, etc.</span>
      <input type="text" id="restrictions" placeholder="" value="${appData.customization["restrictions"] || ""}">
    </div>
    <div class="form-actions right">
      <button class="btn btn-primary" onclick="saveCustomization()">Next</button>
    </div>
  `;
}

function selectArtStyle(style) {
  appData.customization.artStyle = style;
  saveAppData(appData);

  document.querySelectorAll(".art-style-item").forEach((item) => {
    item.classList.remove("selected");
  });
  const selectedItem = document.querySelector(
    `.art-style-item[data-style="${style}"]`,
  );
  if (selectedItem) {
    selectedItem.classList.add("selected");
  }
}

function saveCustomization() {
  // Gather all customization data
  const inputs = document.querySelectorAll(
    "#customization-content input, #customization-content select",
  );
  inputs.forEach((input) => {
    if (input.id && input.value) {
      appData.customization[input.id] = input.value;
    }
  });

  saveAppData(appData);
  goToPage("review.html");
}
