import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "https://bscit.sit.kmutt.ac.th/intproj26/keycloak/",
  realm: "itb-csv",
  clientId: "ip26-zen",
});

async function signIn() {
  await keycloak.init({ onLoad: "login-required", pkceMethod: "S256" });
  return keycloak.tokenParsed;
}

function signOut() {
  const homeUrl = new URL("./index.html", window.location.href).href;
  return keycloak.logout({ redirectUri: homeUrl });
}

function isLecturer(token) {
  const realmRoles = token.realm_access?.roles ?? [];
  const clientRoles = token.resource_access?.["ip26-zen"]?.roles ?? [];
  return [...realmRoles, ...clientRoles].some((role) =>
    ["lecturer", "teacher"].includes(role.toLowerCase()),
  );
}

export { signIn, signOut, isLecturer };
