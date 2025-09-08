Certainly, efendim. Below is a **structured table** view for each of the finalized collections and their respective variables (fields), categorized under **General-Oriented Quizzes** and **Plan-Oriented Quizzes**:

---

### ✅ **1. GENERAL-ORIENTED QUIZZES**

#### 🗂️ `quiz_main_questions`

| Field        | Type            | Description                                   |
| ------------ | --------------- | --------------------------------------------- |
| `slug`       | `string`        | Unique quiz identifier, e.g., `"nutrition"`   |
| `title`      | `string`        | Human-readable quiz title                     |
| `category`   | `string`        | Category such as `"fitness"`, `"mindfulness"` |
| `questions`  | `array<object>` | List of quiz questions                        |
| ↳ `question` | `string`        | Question text                                 |
| ↳ `key`      | `string`        | Answer key used for matching                  |
| ↳ `options`  | `array<string>` | Possible answer options                       |

---

#### 🗂️ `quiz_main_recommendations`

| Field         | Type     | Description                                 |
| ------------- | -------- | ------------------------------------------- |
| `slug`        | `string` | Corresponding quiz slug                     |
| `keys`        | `object` | Answer mapping, e.g., `{ goal: "Balance" }` |
| `title`       | `string` | Title of the recommendation                 |
| `description` | `string` | Recommendation or advice content            |

---

#### 🗂️ `quiz_main_saved`

| Field         | Type        | Description                                               |
| ------------- | ----------- | --------------------------------------------------------- |
| `slug`        | `string`    | Quiz slug                                                 |
| `email`       | `string`    | User email (for identification or analytics)              |
| `answers`     | `object`    | User's submitted answers, e.g., `{ goal: "Gain muscle" }` |
| `result`      | `string`    | Result key or recommendation title                        |
| `submittedAt` | `timestamp` | Submission time                                           |

---

### ✅ **2. PLAN-ORIENTED QUIZZES**

#### 🗂️ `quiz_plan_questions`

| Field        | Type            | Description                             |
| ------------ | --------------- | --------------------------------------- |
| `slug`       | `string`        | Unique plan quiz identifier             |
| `title`      | `string`        | Quiz title for generating a plan        |
| `category`   | `string`        | Category like `"fitness"`, `"wellness"` |
| `questions`  | `array<object>` | List of quiz questions                  |
| ↳ `question` | `string`        | Question text                           |
| ↳ `key`      | `string`        | Key used in the answer mapping          |
| ↳ `options`  | `array<string>` | Answer choices                          |

---

#### 🗂️ `quiz_plan_recommendations`

| Field         | Type     | Description                                              |
| ------------- | -------- | -------------------------------------------------------- |
| `slug`        | `string` | Related quiz slug                                        |
| `keys`        | `object` | Answer key-values for plan generation                    |
| `title`       | `string` | Title of the plan                                        |
| `description` | `string` | Short description of the plan                            |
| `details`     | `object` | (Optional) Detailed plan structure, e.g., daily schedule |

---

#### 🗂️ `quiz_plan_saved`

| Field         | Type        | Description                        |
| ------------- | ----------- | ---------------------------------- |
| `slug`        | `string`    | Quiz slug                          |
| `email`       | `string`    | User's email                       |
| `answers`     | `object`    | Answers submitted by the user      |
| `plan`        | `object`    | Final generated or predefined plan |
| `submittedAt` | `timestamp` | When the plan was saved            |

---

Let me know if you'd like these exported as a JSON schema, MongoDB insert example, or added to your codebase now.
