console.log(document.location.pathname);

// window.addEventListener("DOMContentLoaded", () => {
switch (document.location.pathname) {
	case "/":
		break;
	case "/gg":
		document.body.innerHTML = "gg";
	default:
		document.body.innerHTML = "404";
		break;
}
// });
