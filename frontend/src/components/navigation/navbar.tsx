import ThemeToggle from "../../utils/theme-toggle.util";

export function NavBar() {
  return (
    <nav className="nav">
      <ThemeToggle />
      <a href="/" className="site-title">
        Kaimac's messaging
      </a>
      <ul>
        <li>
          <a href="/group">Group Chats</a>
        </li>
      </ul>
    </nav>
  );
}
