export default function NavbarAvatar({ username }) {

  const firstLetter = username ? username.charAt(0).toUpperCase() : "?";

  return (
    <div style={styles.avatar}>
      {firstLetter}
    </div>
  );
}

const styles = {
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#2563eb",
    color: "white",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px"
  }
};