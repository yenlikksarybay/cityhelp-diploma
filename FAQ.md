# CityHelp Interview Guide

_Шпаргалка для собеседования по проекту CityHelp._  
_Interview cheat sheet for talking about the CityHelp project._

---

## 📚 Contents / Содержание

| Section | Для чего |
|---|---|
| [`🧭 What Is An Information Systems Engineer?`](#what-is-an-information-systems-engineer) | Как объяснить специальность в начале разговора |
| [`🎯 Quick Positioning`](#quick-positioning) | Как коротко и сильно себя представить |
| [`🗣️ If They Hint At Programming`](#if-they-hint-at-programming) | Как самой развить тему после намёка |
| [`🏙️ Project Story`](#project-story) | Как рассказать про CityHelp как продукт |
| [`🧰 Tech Stack`](#tech-stack) | Что говорить про технологии |
| [`🏗️ Architecture`](#architecture) | Как объяснить структуру проекта |
| [`🗄️ Database`](#database) | Что говорить про БД |
| [`📍 Maps & AI`](#maps-and-ai) | Как объяснить Yandex Maps и Gemini |
| [`🚀 Logs & Production`](#logs-and-production) | Что говорить про Vercel, deployment и логи |
| [`👩‍💼 Her Role`](#her-role) | Как описать свою роль честно и сильно |
| [`📋 PM Version`](#pm-version) | Версия ближе к project manager |
| [`🔁 Smart Transitions`](#smart-transitions) | Готовые переходы, чтобы самой вести разговор |
| [`❓ Common Questions`](#common-questions) | Частые вопросы и сильные ответы |
| [`🧠 Glossary`](#glossary) | Термины, которые нужно уверенно знать |
| [`🚫 What Not To Say`](#what-not-to-say) | Что лучше не говорить |
| [`🔥 Final Strong Answer`](#final-strong-answer) | Финальная цельная формулировка |

---

<a id="what-is-an-information-systems-engineer"></a>
## 🧭 What Is An Information Systems Engineer? / Кто такой Инженер информационных систем

| Block | **RU** | **EN** |
|---|---|---|
| **Short definition** | **Инженер информационных систем** - это специалист, который понимает, как проектируются, разрабатываются, интегрируются и поддерживаются цифровые системы для решения реальных задач бизнеса, государства или пользователей. | **An Information Systems Engineer** is a specialist who understands how digital systems are designed, developed, integrated, and maintained to solve real business, government, or user problems. |
| **What this means in practice** | Это не только “писать код”. Это ещё понимать **архитектуру**, **данные**, **API**, **логику ролей**, **интеграции**, **базу данных**, **deployment**, а также связь между технической реализацией и бизнес-задачей. | This is not only about “writing code.” It also means understanding **architecture**, **data**, **APIs**, **role logic**, **integrations**, **databases**, **deployment**, and the connection between technical implementation and the business problem. |
| **How she can say it** | Я воспринимаю инженера информационных систем как человека, который умеет смотреть на систему целиком: от пользовательского сценария и структуры данных до серверной логики, интеграций и поддержки в production. | I see an information systems engineer as someone who can look at a system as a whole: from user flows and data structure to server logic, integrations, and production support. |
| **Why it matches CityHelp** | В проекте CityHelp это хорошо видно: у нас есть интерфейс, backend, база данных, AI-модуль, карта, роли пользователей, файловое хранилище и production deployment. То есть это именно пример информационной системы, а не только отдельного сайта. | This is clearly visible in CityHelp: we have an interface, backend, database, AI module, map integration, user roles, file storage, and production deployment. So it is a real information system, not just a standalone website. |

### ✨ Quick Memory Line

| **RU** | **EN** |
|---|---|
| **Инженер информационных систем = человек, который понимает систему целиком, а не только одну её часть.** | **An Information Systems Engineer = a person who understands the whole system, not just one isolated part of it.** |

---

<a id="quick-positioning"></a>
## 🎯 Quick Positioning / Короткое позиционирование

| Block | **RU** | **EN** |
|---|---|---|
| **How to use** | *Если интервьюер только намекнул на программирование, не нужно отвечать одним предложением.* Лучше коротко начать с проекта, потом перейти к стеку, архитектуре, БД и production. | *If the interviewer only hints at programming, she should not answer in one short sentence.* It is better to briefly start with the project, then move to the stack, architecture, database, and production. |
| **Main principle** | **Важно звучать честно.** Не говорить, что она написала весь проект одна, но уверенно показывать, что она хорошо понимает систему и реально участвовала в её разработке и координации. | **It is important to sound honest.** She should not say that she built the whole project alone, but she should confidently show that she understands the system and genuinely participated in its development and coordination. |
| **Shortest intro** | Мы вместе разрабатывали **CityHelp**, это digital-платформа для обработки обращений граждан. Я участвовала не только в организационной части, но и на базовом техническом уровне: понимала структуру проекта, роли пользователей, API flow, базу данных, работу AI-модуля, а также следила за задачами, выкладками и проверкой работы в production. | We developed **CityHelp** together, and it is a digital platform for handling citizen appeals. I contributed not only on the organizational side but also at a practical technical level: I understood the project structure, user roles, API flow, database, AI module, and I also followed tasks, deployments, and production behavior. |

---

<a id="if-they-hint-at-programming"></a>
## 🗣️ If They Hint At Programming / Если только намекнули на программирование

| Type | **RU** | **EN** |
|---|---|---|
| **Good opening** | Да, я тоже была вовлечена в техническую часть. Я не позиционирую себя как единственный разработчик проекта, но я хорошо понимала, как он устроен: какие технологии мы выбрали, как устроен backend внутри Nuxt, как хранятся данные в MongoDB, как работает AI-анализ через Gemini, как мы используем Yandex Maps, Vercel и Vercel Blob. Поэтому я могла не просто участвовать в обсуждении, а понимать, зачем каждая часть нужна. | Yes, I was also involved in the technical part. I do not present myself as the only developer of the project, but I understood well how it worked: which technologies we chose, how the backend was built inside Nuxt, how data was stored in MongoDB, how AI analysis worked through Gemini, and how we used Yandex Maps, Vercel, and Vercel Blob. So I was able not only to participate in discussions, but also to understand why each part was needed. |
| **Memory cue** | **Ключ:** _“Я не единственный разработчик, но я хорошо понимала систему.”_ | **Key:** _“I was not the only developer, but I understood the system well.”_ |

---

<a id="project-story"></a>
## 🏙️ Project Story / Основной рассказ о проекте

| Part | **RU** | **EN** |
|---|---|---|
| **What the project is** | **CityHelp** - это система, где пользователь может создать обращение с описанием, фотографиями и точкой на карте. Дальше это обращение проходит AI-анализ, потом ручную модерацию администратором, затем назначается сотруднику, после чего идёт выполнение, финальная проверка и пользовательская оценка результата. | **CityHelp** is a system where a user can create an appeal with a description, photos, and a point on the map. After that, the appeal goes through AI analysis, then manual moderation by an administrator, then it is assigned to an employee, followed by execution, final review, and user rating of the result. |
| **Why it matters** | Мне было важно понимать проект **end-to-end**, потому что это помогало и в командной работе, и в обсуждении функций, и в принятии решений по структуре продукта. | It was important for me to understand the project **end-to-end** because it helped in teamwork, feature discussions, and decisions about the product structure. |
| **Easy summary** | **Коротко:** _“Это full-cycle система обработки обращений граждан.”_ | **Shortly:** _“It is a full-cycle system for handling citizen appeals.”_ |

---

<a id="tech-stack"></a>
## 🧰 Tech Stack / Что говорить про технологии

| Technology | **Для чего / RU** | **How to explain / EN** |
|---|---|---|
| **Nuxt 4 + Vue 3** | Интерфейс и fullstack-основа проекта. Это позволило держать frontend и backend в одном проекте и быстрее разрабатывать продукт. | Interface and fullstack foundation of the project. It allowed us to keep frontend and backend in one project and build faster. |
| **Nitro + server API routes** | Серверная часть внутри Nuxt. Нам не нужно было поднимать отдельный backend-сервис. | Server side inside Nuxt. We did not need a separate backend service. |
| **MongoDB + Mongoose** | Хранение обращений, пользователей, категорий, FAQ и AI-prompts. Mongoose нужен для схем, валидации и структуры данных. | Storage for appeals, users, categories, FAQ, and AI prompts. Mongoose helped with schemas, validation, and data structure. |
| **Gemini AI** | Первичный анализ фото и текста обращения. AI предлагает категорию, приоритет и summary, но финальное решение остаётся за человеком. | Initial analysis of appeal photos and text. The AI suggests category, priority, and summary, but the final decision stays with a human. |
| **Yandex Maps** | Выбор точки обращения на карте, координаты, адрес и heatmap для аналитики. | Appeal location selection, coordinates, address, and heatmap analytics. |
| **Vercel** | Production deployment. Удобно для fullstack-проекта, потому что можно выкатывать как единую систему. | Production deployment. Convenient for a fullstack project because it can be deployed as one system. |
| **Vercel Blob** | Хранение фото обращений, фото результата и аватаров. | Storage for appeal photos, result photos, and avatars. |
| **Pinia** | Глобальное состояние: данные пользователя, уведомления, часть UI-логики. | Global state: user data, notifications, and part of the UI logic. |
| **i18n** | Мультиязычность: `kz`, `ru`, `en`. | Multilingual support: `kz`, `ru`, `en`. |

### ✨ Quick Memory Line

| **RU** | **EN** |
|---|---|
| Мы выбрали технологии не просто потому что они популярные, а потому что они хорошо подходили под **единый fullstack-проект с картой, AI, БД и production deployment**. | We chose the technologies not just because they were popular, but because they fit a **single fullstack project with maps, AI, database, and production deployment**. |

---

<a id="architecture"></a>
## 🏗️ Architecture / Как говорить про архитектуру

| Point | **RU** | **EN** |
|---|---|---|
| **Main idea** | У проекта единая **fullstack-архитектура**. В папке `app` находится клиентская часть, а в `server` - API, services, models и утилиты. | The project has a unified **fullstack architecture**. The `app` folder contains the client side, and `server` contains the API, services, models, and utilities. |
| **Why it is convenient** | Такой подход удобен, потому что меньше лишней инфраструктуры и проще синхронизировать интерфейс и серверную логику. | This approach is convenient because it reduces extra infrastructure and makes it easier to keep the interface and server logic in sync. |
| **Her angle** | Мне было важно понимать не только внешний интерфейс, но и то, как данные проходят через систему: от формы создания обращения до хранения в базе, AI-анализа и финального отображения в панели. | It was important for me to understand not only the visible interface but also how data moved through the system: from the appeal creation form to database storage, AI analysis, and final display in the dashboard. |

---

<a id="database"></a>
## 🗄️ Database / Как говорить про базу данных

| Topic | **RU** | **EN** |
|---|---|---|
| **Main entity** | Основная сущность в проекте - это **`Appeal`**. | The main entity in the project is **`Appeal`**. |
| **What it stores** | Автор обращения, описание проблемы, фотографии, координаты, категория, приоритет, назначенный сотрудник, AI-result, timeline и rating. | It stores the appeal author, problem description, photos, coordinates, category, priority, assigned employee, AI result, timeline, and rating. |
| **Other entities** | Кроме этого, у нас есть **`User`**, **`Category`**, **`Faq`**, **`Prompt`** и **`AiTrainingCase`**. | In addition, we have **`User`**, **`Category`**, **`Faq`**, **`Prompt`**, and **`AiTrainingCase`**. |
| **If asked “Did you manage DB?”** | Я понимала структуру коллекций, логику сущностей, связи между ролями и обращениями, участвовала в обсуждении того, как лучше хранить данные и что именно должно лежать в каждой модели. | I understood the structure of the collections, the logic of the entities, the connections between roles and appeals, and I participated in discussions about how data should be stored and what each model should contain. |

### 🧠 Easy Memory Cue

| **RU** | **EN** |
|---|---|
| **Ключ к БД:** _“Я понимала структуру данных, а не просто названия коллекций.”_ | **Database key:** _“I understood the data structure, not just the collection names.”_ |

---

<a id="maps-and-ai"></a>
## 📍 Maps & AI / Как говорить про Yandex Maps и Gemini

| Tool | **RU** | **EN** |
|---|---|---|
| **Yandex Maps** | Нужен был для выбора точки обращения на карте и для работы с геоданными. Пользователь указывает место проблемы, система сохраняет координаты и адрес, а в панели управления мы используем heatmap для аналитики. | It was used to select the appeal location on the map and to work with geodata. The user marks the problem location, the system stores the coordinates and address, and on the dashboard we use a heatmap for analytics. |
| **Gemini AI** | Использовался для первичного анализа обращения. AI не принимает финальное решение сам, а подготавливает структурированный разбор: что видно на фото, какая категория наиболее вероятна, какой приоритет и какие есть uncertainties. | It was used for the initial analysis of an appeal. The AI does not make the final decision by itself, but prepares a structured analysis: what is visible in the photo, which category is most likely, what the priority is, and what uncertainties remain. |
| **Important line** | **AI ускоряет работу, но не заменяет человека.** | **AI speeds up the work, but does not replace a human.** |

---

<a id="logs-and-production"></a>
## 🚀 Logs & Production / Как говорить про логи и production

| Topic | **RU** | **EN** |
|---|---|---|
| **Platform** | В production мы использовали **Vercel**. | In production we used **Vercel**. |
| **What was checked** | После deployment было важно проверять, как ведут себя серверные API, загрузка файлов, авторизация и AI-запросы. | After deployment, it was important to check how server APIs, file uploads, authorization, and AI requests behaved. |
| **How to describe her involvement** | Я следила за логикой ошибок, статусами ответов и тем, чтобы после выкладки функционал вёл себя корректно. Это особенно важно в fullstack-проекте, где одна ошибка на backend сразу отражается на пользовательском сценарии. | I followed the error logic, response statuses, and whether the functionality behaved correctly after deployment. This is especially important in a fullstack project, where a backend issue immediately affects the user flow. |
| **Best one-line answer** | Я следила за поведением проекта после выкладки, проверяла API-сценарии, авторизацию, работу с файлами и помогала быстро находить проблемные места по логам и ошибкам. | I monitored the project behavior after deployment, checked API scenarios, authorization, and file handling, and helped identify problematic areas quickly through logs and errors. |

---

<a id="her-role"></a>
## 👩‍💼 Her Role / Как описывать свою роль

| Style | **RU** | **EN** |
|---|---|---|
| **Strong and honest** | Я участвовала в проекте на стыке **product thinking** и технического понимания. Мне важно было не только видеть задачи в Trello, но и понимать, как они будут реализованы в системе, как это повлияет на БД, API, роли пользователей и production behavior. | I participated in the project at the intersection of **product thinking** and technical understanding. It was important for me not only to see tasks in Trello, but also to understand how they would be implemented in the system and how they would affect the database, API, user roles, and production behavior. |
| **Short form** | Я была полезна тем, что могла обсуждать проект не только как пользовательскую идею, но и как рабочую техническую систему. | I was useful because I could discuss the project not only as a user idea, but also as a working technical system. |
| **Memory cue** | **Формула:** _“Я понимала и продукт, и реализацию.”_ | **Formula:** _“I understood both the product and the implementation.”_ |

---

<a id="pm-version"></a>
## 📋 PM Version / Версия ближе к PM

| Angle | **RU** | **EN** |
|---|---|---|
| **Main emphasis** | Если интервью больше идёт в сторону PM или coordination, можно сделать акцент на следующем: я работала с задачами через Trello, участвовала в приоритизации, обсуждала флоу, структуру модулей и зависимостей, следила за тем, чтобы реализация соответствовала тому, что мы планировали в продукте. | If the interview moves more toward PM or coordination, she can emphasize the following: I worked with tasks through Trello, participated in prioritization, discussed flows, module structure, and dependencies, and made sure that the implementation matched what we had planned on the product side. |
| **Important nuance** | Моя сильная сторона в том, что я не просто *manager without technical context*, а человек, который понимает, из каких частей состоит система и как они между собой связаны. | My strength is that I am not just a *manager without technical context*, but a person who understands what parts the system consists of and how they are connected. |

---

<a id="smart-transitions"></a>
## 🔁 Smart Transitions / Готовые переходы

| # | **RU** | **EN** |
|---|---|---|
| **1** | Если коротко, мы выбрали fullstack-подход на Nuxt, чтобы быстрее собирать и продукт, и API в одном месте. | In short, we chose a fullstack approach with Nuxt so that we could build both the product and the API in one place faster. |
| **2** | Если говорить про данные, у нас ключевая сущность - это appeal, и вокруг неё строится почти вся логика системы. | If we talk about data, our key entity is the appeal, and almost all system logic is built around it. |
| **3** | Если говорить про AI, мы использовали его как инструмент анализа, а не как полную замену человеку. | If we talk about AI, we used it as an analysis tool, not as a full replacement for a human. |
| **4** | Если говорить про мою роль, я была полезна именно тем, что понимала и продуктовую, и техническую сторону. | If we talk about my role, I was useful precisely because I understood both the product side and the technical side. |
| **5** | С точки зрения production нам было важно не только разработать фичу, но и проверить, как она ведёт себя после deployment. | From a production perspective, it was important for us not only to develop a feature but also to check how it behaved after deployment. |

---

<a id="common-questions"></a>
## ❓ Common Questions / Частые вопросы и сильные ответы

| Question | **RU** | **EN** |
|---|---|---|
| **1. Расскажите о проекте / Tell me about the project** | CityHelp - это цифровая платформа для обработки обращений граждан. Пользователь может создать обращение с фото, описанием и точкой на карте, затем система делает AI-анализ, после чего обращение проходит модерацию, назначается сотруднику, выполняется и в конце оценивается пользователем. | CityHelp is a digital platform for handling citizen appeals. A user can create an appeal with photos, a description, and a location on the map. Then the system performs AI analysis, after which the appeal goes through moderation, is assigned to an employee, completed, and finally rated by the user. |
| **2. Какие технологии вы использовали? / What technologies did you use?** | Основной стек - Nuxt 4, Vue 3, Nitro server API, MongoDB с Mongoose, Gemini AI, Yandex Maps, Vercel и Vercel Blob. Для меня было важно понимать, для чего каждая технология выбрана и как она помогает продукту. | The main stack was Nuxt 4, Vue 3, Nitro server API, MongoDB with Mongoose, Gemini AI, Yandex Maps, Vercel, and Vercel Blob. It was important for me to understand why each technology was chosen and how it supported the product. |
| **3. Почему MongoDB? / Why MongoDB?** | Потому что у нас обращение содержит много вложенных данных и документная модель подошла лучше. Кроме того, MongoDB удобно расширять, когда продукт ещё развивается. | Because our appeal contains many nested fields, and a document model fit better. Also, MongoDB is convenient to extend when the product is still evolving. |
| **4. Как использовался AI? / How was AI used?** | AI анализировал фото и текст обращения, предлагал категорию, приоритет и summary, но окончательное решение оставалось за администратором. Это ускоряло работу, но сохраняло контроль качества. | The AI analyzed the appeal photo and text, suggested a category, priority, and summary, but the final decision remained with the administrator. This sped up the work while preserving quality control. |
| **5. В чём была ваша роль? / What was your role?** | Я участвовала в обсуждении структуры проекта, понимала логику модулей, ролей, данных и API flow, работала с задачами в Trello и помогала держать связь между продуктовой частью и технической реализацией. | I participated in discussing the project structure, understood the logic of modules, roles, data, and API flow, worked with tasks in Trello, and helped maintain the connection between the product side and the technical implementation. |
| **6. Как вы работали в команде? / How did you work in the team?** | Мы вели задачи через Trello, обсуждали решения, затем работали с кодовой базой через GitHub и выкатывали изменения через Vercel. Мне нравился этот процесс, потому что он был прозрачным и хорошо контролировался. | We managed tasks through Trello, discussed solutions, then worked with the codebase through GitHub and deployed changes through Vercel. I liked this process because it was transparent and well controlled. |
| **7. Как вы проверяли результат? / How did you verify the result?** | Мы проверяли пользовательские сценарии, API-поведение, работу авторизации, загрузку файлов и то, как всё ведёт себя после deployment. Для меня было важно видеть не только идею, но и реальное качество работы функции. | We checked user flows, API behavior, authorization, file uploads, and how everything behaved after deployment. It was important for me to see not only the idea but also the actual quality of the feature in practice. |
| **8. Есть ли у вас опыт работы с БД? / Do you have experience with databases?** | Да, на базовом рабочем уровне. Я понимала структуру данных проекта, основные сущности, поля и логику хранения. Также участвовала в обсуждении того, как лучше организовать модели и связи. | Yes, at a solid practical basic level. I understood the project data structure, the main entities, fields, and storage logic. I also participated in discussions about how to organize models and relationships better. |
| **9. Есть ли у вас опыт с логами и production? / Do you have experience with logs and production?** | Да, в рамках проекта я следила за тем, как система ведёт себя после выкладки, и понимала важность проверки API, ошибок, логов и стабильности production-сценариев. | Yes. Within the project, I followed how the system behaved after deployment and understood the importance of checking APIs, errors, logs, and the stability of production scenarios. |
| **10. Почему вы подходите на стажировку? / Why are you a good fit for the internship?** | Потому что я умею быстро входить в контекст, понимаю и продуктовую, и техническую сторону, умею работать в команде и не боюсь разбираться в новых инструментах. У меня уже есть опыт участия в реальном fullstack-проекте, пусть и не как у senior-разработчика, но как у человека, который глубоко понимает систему и умеет быть полезным. | Because I can quickly get into context, I understand both the product and technical sides, I work well in a team, and I am not afraid to learn new tools. I already have experience participating in a real fullstack project, not as a senior developer, but as someone who understands the system deeply and knows how to be useful. |

---

<a id="glossary"></a>
## 🧠 Glossary / Словарь терминов

| Term | **RU** | **EN** |
|---|---|---|
| **Frontend** | Пользовательский интерфейс. | The user interface. |
| **Backend** | Серверная логика и API. | Server logic and APIs. |
| **API** | Способ, через который клиент и сервер обмениваются данными. | The way the client and server exchange data. |
| **Database schema** | Структура данных и полей в базе. | The structure of data and fields in the database. |
| **Deployment** | Выкладка проекта в рабочее окружение. | Releasing the project into a working environment. |
| **Production** | Рабочая версия проекта, которой пользуются реальные пользователи. | The live version of the project used by real users. |
| **Logs** | Записи о событиях и ошибках системы. | Records of system events and errors. |
| **Role-based access** | Доступ к функциям по роли пользователя. | Access to features based on the user role. |
| **Moderation** | Этап ручной проверки перед следующим шагом. | The stage of manual review before the next step. |

---

<a id="what-not-to-say"></a>
## 🚫 What Not To Say / Что лучше не говорить

| ❌ Avoid | ✅ Better Alternative |
|---|---|
| **RU:** Я всё полностью писала сама.  **EN:** I built everything completely by myself. | **RU:** Я участвовала в техническом обсуждении, понимала архитектуру и ключевые модули и могла уверенно работать на стыке задач, продукта и реализации.  **EN:** I participated in technical discussions, understood the architecture and key modules, and could work confidently at the intersection of tasks, product, and implementation. |
| **RU:** Я только помогала с Trello.  **EN:** I only helped with Trello. | **RU:** Я работала с задачами, но при этом понимала, как они реализуются технически.  **EN:** I worked with tasks, but I also understood how they were implemented technically. |
| **RU:** Я не очень понимаю техническую часть.  **EN:** I do not really understand the technical part. | **RU:** Я не была единственным разработчиком, но хорошо понимала систему и ключевые модули.  **EN:** I was not the only developer, but I understood the system and its key modules well. |

---

<a id="final-strong-answer"></a>
## 🔥 Final Strong Answer / Финальная сильная версия ответа

| **RU** | **EN** |
|---|---|
| В CityHelp мне была близка именно связка между разработкой и организацией. Я понимала, как устроен fullstack-проект: интерфейс на Nuxt/Vue, серверные API внутри Nuxt, MongoDB для хранения данных, Gemini для AI-анализа, Yandex Maps для геолокации, Vercel для production и Vercel Blob для файлов. При этом я работала не только как человек, который видит задачи, но и как человек, который понимает, как они реализуются в системе. Поэтому я думаю, что смогу быть полезной и как intern в технической среде, и как человек, который быстро встраивается в команду и продукт. | What was especially close to me in CityHelp was the connection between development and organization. I understood how a fullstack project worked: the interface on Nuxt/Vue, server APIs inside Nuxt, MongoDB for data storage, Gemini for AI analysis, Yandex Maps for geolocation, Vercel for production, and Vercel Blob for files. At the same time, I worked not only as a person who sees tasks, but as someone who understands how they are implemented in the system. That is why I believe I can be useful both as an intern in a technical environment and as someone who quickly integrates into a team and product. |
