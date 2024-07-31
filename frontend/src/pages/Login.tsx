import LoginButton from "../components/login/login.button";
import providers from "../components/login/providers";

export default function Login() {
  return (
    <>
      <ul>
        {providers.map((entry: string) => (
          <li>
            <LoginButton key={entry} name={entry} />
          </li>
        ))}
      </ul>
    </>
  );
}
