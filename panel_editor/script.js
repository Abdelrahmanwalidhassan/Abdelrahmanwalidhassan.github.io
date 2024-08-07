window.addEventListener("DOMContentLoaded", async () => {
	const url = new URL(window.location.href);
	let id = url.searchParams.get("id");
	let base64_data = url.searchParams.get("data");
	// if (!id) document.body.innerText = 'Invaild Id use (/panels_manager setup start) to get one';

	// let idData = await (
	// 	await fetch('http://127.0.0.1:8080/api/panel-manager?id=' + id).catch((e) => console.error(e.message))
	// )
	// 	.json()
	// 	.catch((e) => console.error(e.message));

	let idData = {
		// id: '66aa915bbd0fc420a84fd53c',
		// name: 'Test',
		// description: 'Description',
		// status: 'vip',
		// schedule: {
		// 	enabled: true,
		// 	utcOffset: 3,
		// 	days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
		// 	open: 1,
		// 	close: 23
		// },
		// maxTickets: 69,
		// ticketsCount: 10,
		// permissions: { opened: { admins: ['SendMessages'] } }
	};

	let guildData = {};

	// if (!idData) document.body.innerText = 'Invaild data use (/panels_manager setup start) to get one';

	const form = document.getElementById("panel-form");
	const guildInput = document.getElementById("guild-data-input");
	const panelInput = document.getElementById("panel-data-input");
	const name = document.getElementById("name");
	const description = document.getElementById("description");
	const status = document.getElementById("status");
	const schedule_status = document.getElementById("schedule-status");
	const schedule_open = document.getElementById("schedule-open");
	const schedule_close = document.getElementById("schedule-close");
	const schedule_utc_offset = document.getElementById("utc-offset");
	const max_tickets = document.getElementById("max-tickets");
	const tickets_count = document.getElementById("tickets-count");
	const button = document.getElementById("submit");
	const days = document.getElementsByName("days");
	const role_select = document.getElementById("role-select");
	const role_option = document.getElementById("role-option");
	const logs = document.getElementById("logs");
	const logs2 = document.getElementById("logs2");
	const logs3 = document.getElementById("logs3");
	const parents = document.getElementById("parents");
	const parents2 = document.getElementById("parents2");
	const perms = document.getElementById("perm-con");
	const state_select = document.getElementById("state-select");
	const state_role_select = document.getElementById("state-role-select");
	const creation_form_status = document.getElementById("form-status");
	const form_title = document.getElementById("form-title");
	const questionsContainer = document.getElementById("questions-container");
	const addQuestionButton = document.getElementById("add-question-button");

	const elements = [
		name,
		description,
		status,
		schedule_status,
		schedule_open,
		schedule_close,
		schedule_utc_offset,
		max_tickets,
		tickets_count,
		...days,
		button,
	];

	guildInput.addEventListener("change", handleFileSelect);
	panelInput.addEventListener("change", handleFileSelect);

	function handleFileSelect(event) {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const base64String = e.target.result;
				try {
					if (event.target.id === "guild-data-input") {
						guildData = JSON.parse(base64String);
						if (!(guildData.id || guildData.channels || guildData.roles))
							return alert("Invalid data format");
						document.getElementById("con").style.display = "block";
					} else if (event.target.id === "panel-data-input")
						idData = JSON.parse(atob(base64String));

					// if (idData.guildId !== guildData.id) {
					// document.getElementById("con").style.display = "none";
					// return alert("Invalid data format");
					// } else {
					update();

					days.forEach((e) => {
						if (idData.schedule?.days?.includes(e.id)) e.checked = true;
						else e.checked = false;
					});
					// }
				} catch (error) {
					console.error("Error parsing base64 string:", error);
					alert("Invalid data format");
				}
			};
			reader.readAsText(file);
		}
	}

	let questions = [];

	async function update() {
		name.value = idData.name || "";
		description.value = idData.description || "";
		status.value =
			(idData.status || "open").charAt(0).toUpperCase() +
			(idData.status || "open").slice(1);
		schedule_status.value = idData.schedule?.enabled ? "Enabled" : "Disabled";
		schedule_open.value =
			addLeadingZeros(idData.schedule?.open || 1, 2) + ":00";
		schedule_close.value =
			addLeadingZeros(idData.schedule?.close || 23, 2) + ":00";
		schedule_utc_offset.value =
			(idData.schedule || 0)?.utcOffset > 0
				? "+" + idData.schedule?.utcOffset
				: idData.schedule?.utcOffset || 0;
		max_tickets.value = idData.maxTickets || "500";
		tickets_count.innerText = idData.ticketsCount || "0";

		questions = idData.creationForm?.questions || [];
		form_title.value = idData.creationForm?.title || "";
		creation_form_status.value = idData.creationForm?.enabled
			? "true"
			: "false";

		role_select.addEventListener("change", (e) => {
			role_option.innerHTML = guildData.roles
				.map(
					(r) =>
						`<div class="gender">` +
						`<input type="checkbox" name="role-option-select" id="${r.id}" ${
							idData.roles?.[e.target.value]?.includes(r.id) ? "checked" : ""
						} />` +
						`<label for="${r.id}">${r.name}</label>` +
						`</div>`,
				)
				.join("");

			document.getElementsByName("role-option-select").forEach((e) =>
				e.addEventListener("change", (e) => {
					console.log(e.target.id);
					const role = role_select.value;

					if (!idData.roles) idData.roles = {};
					if (!idData.roles[role]) idData.roles[role] = [];

					if (e.target.checked) idData.roles[role].push(e.target.id);
					else
						idData.roles[role] = idData.roles[role].filter(
							(r) => r !== e.target.id,
						);
					console.log(idData);
				}),
			);
		});

		const ch_func = (e) =>
			`<div class="input-box">` +
			`<label>${e.charAt(0).toUpperCase() + e.slice(1)} logs</label>` +
			`<div class="select-box">` +
			`<select id="${e}" name="log-channel-select">` +
			`<option value="">None</option>` +
			guildData.channels
				?.filter((c) => c.type === 0)
				.map(
					(c) =>
						`<option value="${c.id}" ${
							c.id === idData.logChannelIds?.[e] ? "selected" : ""
						}>${c.name + " (" + c.id + ")"}</option>`,
				)
				.join("") +
			`</select>` +
			`</div>` +
			`</div>`;

		logs.innerHTML = ["edited", "opened"].map(ch_func);
		logs2.innerHTML = ["deleted", "created"].map(ch_func);
		logs3.innerHTML = ["closed", "claimed", "transcript"].map(ch_func);

		document.getElementsByName("log-channel-select").forEach((e) =>
			e.addEventListener("change", (e) => {
				if (!idData.logChannelIds) idData.logChannelIds = {};
				console.log(e.target.id, e.target.value);

				idData.logChannelIds[e.target.id] = e.target.value;
			}),
		);

		const cat_func = (e) =>
			`<div class="input-box">` +
			`<label>${e.charAt(0).toUpperCase() + e.slice(1)} parent</label>` +
			`<div class="select-box">` +
			`<select id="${e}" name="perent-category-select">` +
			`<option value="">None</option>` +
			guildData.channels
				?.filter((c) => c.type === 4)
				.map(
					(c) =>
						`<option value="${c.id}">${c.name + " (" + c.id + ")"}</option>`,
				)
				.join("") +
			`</select>` +
			`</div>` +
			`</div>`;

		parents.innerHTML = ["opened", "claimed"].map(cat_func);
		parents2.innerHTML = ["vips", "closed"].map(cat_func);

		document.getElementsByName("perent-category-select").forEach((e) =>
			e.addEventListener("change", (e) => {
				if (!idData.parentIds) idData.parentIds = {};
				idData.parentIds[e.target.id] = e.target.value;
			}),
		);

		const TextChannelPermissions = [
			"ManageChannels",
			"AddReactions",
			"ViewChannel",
			"SendMessages",
			"SendTTSMessages",
			"ManageMessages",
			"EmbedLinks",
			"AttachFiles",
			"ReadMessageHistory",
			"MentionEveryone",
			"UseExternalEmojis",
			"ManageRoles",
			"ManageWebhooks",
			"UseApplicationCommands",
			"ManageThreads",
			"CreatePrivateThreads",
			"UseExternalStickers",
			"SendVoiceMessages",
			"UseExternalApps",
		];

		[state_select, state_role_select].forEach((e) =>
			e.addEventListener("change", updatePermSelect),
		);

		function updatePermSelect() {
			const state = state_select.value;
			const role = state_role_select.value;

			if (!state || !role) return;

			perms.innerHTML = TextChannelPermissions.map(
				(r) =>
					`<div class="gender">` +
					`<input type="checkbox" name="perm" id="${
						state + "-" + role + "-" + r
					}" ${
						idData.permissions?.[state]?.[role]?.includes(r) ? "checked" : ""
					}/>` +
					`<label for="${state + "-" + role + "-" + r}">${r}</label>` +
					`</div>`,
			).join("");

			document.getElementsByName("perm").forEach((e) =>
				e.addEventListener("change", (ee) => {
					const state = state_select.value;
					const role = state_role_select.value;

					console.log(
						!idData.permissions?.[state]?.[role]?.includes(
							ee.target.id.split("-")[2],
						),
					);

					if (
						ee.target.checked &&
						!idData.permissions?.[state]?.[role]?.includes(
							ee.target.id.split("-")[2],
						)
					) {
						if (!idData.permissions) idData.permissions = {};
						if (!idData.permissions[state]) idData.permissions[state] = {};
						if (!idData.permissions[state][role])
							idData.permissions[state][role] = [];

						idData.permissions[state][role].push(ee.target.id.split("-")[2]);
					} else if (
						!ee.target.checked &&
						idData.permissions?.[state]?.[role]?.includes(
							ee.target.id.split("-")[2],
						)
					) {
						idData.permissions[state][role] = idData.permissions[state][
							role
						].filter((d) => d !== ee.target.id.split("-")[2]);
					}

					console.log(idData.permissions);
				}),
			);
		}

		function logFormOptions() {
			console.log({
				enabled: creation_form_status.value == "true",
				title: form_title.value,
				questions,
			});
		}

		function createQuestionElement(index) {
			const question = questions[index];

			const questionDiv = document.createElement("div");
			questionDiv.className = "question";
			questionDiv.dataset.index = index;

			questionDiv.innerHTML = `
            <div class="input-box">
                <label for="question-name-${index}">Question Name</label>
                <input id="question-name-${index}" type="text" placeholder="Enter Question Name" value="${
				question.name
			}" required />
            </div>
            <div class="input-box">
                <label for="question-placeholder-${index}">Placeholder</label>
                <input id="question-placeholder-${index}" type="text" placeholder="Enter Placeholder" value="${
				question.placeholder
			}" required />
            </div>
            <div class="input-box">
                <label for="question-required-${index}">Required</label>
                <input id="question-required-${index}" type="checkbox" ${
				question.required ? "checked" : ""
			} />
            </div>
            <div class="input-box">
                <label for="question-max-length-${index}">Max Length</label>
                <input id="question-max-length-${index}" type="number" value="${
				question.max_length
			}" required />
            </div>
            <div class="input-box">
                <label for="question-min-length-${index}">Min Length</label>
                <input id="question-min-length-${index}" type="number" value="${
				question.min_length
			}" required />
            </div>
            <div class="input-box">
                <label for="question-multi-line-${index}">Multi Line</label>
                <input id="question-multi-line-${index}" type="checkbox" ${
				question.multi_line ? "checked" : ""
			} />
            </div>
						<button class="delete-question-button" type="button">Delete</button>
        `;

			questionsContainer.appendChild(questionDiv);

			questionDiv.querySelectorAll("input, select").forEach((input) => {
				input.addEventListener("input", () => {
					const index = questionDiv.dataset.index;
					questions[index] = {
						...questions[index],
						name: document.getElementById(`question-name-${index}`).value,
						placeholder: document.getElementById(
							`question-placeholder-${index}`,
						).value,
						required: document.getElementById(`question-required-${index}`)
							.checked,
						max_length: parseInt(
							document.getElementById(`question-max-length-${index}`).value,
							10,
						),
						min_length: parseInt(
							document.getElementById(`question-min-length-${index}`).value,
							10,
						),
						multi_line: document.getElementById(`question-multi-line-${index}`)
							.checked,
					};
					logFormOptions();
				});
			});

			questionDiv
				.querySelector(".delete-question-button")
				.addEventListener("click", () => {
					deleteQuestion(index);
				});
		}

		function addQuestion() {
			if (questions.length >= 5) {
				alert("Maximum of 5 questions allowed");
				return;
			}

			const newQuestion = {
				id: `question-${questions.length + 1}`,
				name: "",
				placeholder: "",
				required: false,
				max_length: 100,
				min_length: 1,
				multi_line: false,
			};

			questions.push(newQuestion);
			createQuestionElement(questions.length - 1);
			logFormOptions();
		}

		function deleteQuestion(index) {
			questions = questions.filter((_, i) => i !== index);
			questionsContainer.innerHTML = "";
			questions.forEach((_, i) => createQuestionElement(i));
			logFormOptions();
		}

		questions.forEach((_, index) => createQuestionElement(index));

		addQuestionButton.addEventListener("click", addQuestion);

		form_title.addEventListener("input", logFormOptions);
	}

	days?.forEach((e) => {
		if (idData.schedule?.days?.includes(e.id)) e.checked = true;
		else e.checked = false;
		e.addEventListener("click", (ee) => {
			if (
				ee.target.checked &&
				(!idData.schedule || idData.schedule.days?.includes(ee.target.id))
			) {
				idData.schedule = {
					days: [ee.target.id],
				};
			} else if (
				ee.target.checked &&
				!idData.schedule?.days?.includes(ee.target.id)
			) {
				idData.schedule.days.push(ee.target.id);
			} else if (
				!ee.target.checked &&
				idData.schedule.days.includes(ee.target.id)
			) {
				idData.schedule.days = idData.schedule.days.filter(
					(d) => d !== ee.target.id,
				);
			}
		});
	});

	creation_form_status.addEventListener("change", (e) => {
		if (creation_form_status.value == "true") form_title.required = true;
		else form_title.required = false;
	});

	form.addEventListener("submit", async (e) => {
		/**
		 * @type {import ("../../models/ticket-panels").IPanel}
		 */
		const data = {};
		e.preventDefault();
		var element = document.getElementById("bottom-right-element");
		element.innerText = "Saving data...";
		element.style.display = "block";
		setTimeout(() => (element.style.display = "none"), 2500);

		data.name = name.value || "";
		data.description = description.value || "";
		data.status = status.value.toLowerCase() || "open";
		data.schedule = {};
		data.schedule.enabled = schedule_status.value == "Enabled" ? true : false;
		data.schedule.open = Number(schedule_open.value.split(":")[0] || 1);
		data.schedule.close = Number(schedule_close.value.split(":")[0] || 23);
		data.schedule.utcOffset = Number(schedule_utc_offset.value || 0);
		data.schedule.days = idData.schedule?.days || [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		];
		data.maxTickets = Number(max_tickets.value || 500);
		data.ticketsCount = Number(tickets_count.value || 0);
		data.permissions = idData.permissions || {};
		data.roles = idData.roles || {};
		data.logChannelIds = idData.logChannelIds || {};
		data.parentIds = idData.parentIds || {};
		data.creationForm = {
			enabled: creation_form_status.value == "true",
			title: form_title.value,
			questions: questions,
		};

		try {
			const base64Data = btoa(JSON.stringify(data));

			console.log(base64Data);

			const blob = new Blob([base64Data], { type: "text/plain" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "panel-data.txt";
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
			element.innerText = "Processed data successfully";
		} catch (e) {
			element.innerText = "Failed to process data";
			element.style.borderColor = "red";
			console.error(e.message);
		}
		// 	await fetch('http://127.0.0.1:8080/api/panel-manager', {
		// 		method: 'POST',
		// 		headers: {
		// 			'Content-Type': 'application/json'
		// 		},
		// 		body: JSON.stringify(data)
		// 	}).then((res) => {
		// 		if (res.ok) {
		// 			element.innerText = 'Saved data successfully';
		// 		} else {
		// 			element.innerText = 'Failed to save data';
		// 			element.style.borderColor = 'red';
		// 		}
		// 	});
	});
});

function addLeadingZeros(num, totalLength) {
	return String(num).padStart(totalLength, "0");
}
