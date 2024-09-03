import {
  ActionIcon,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { BsMoonStars } from "react-icons/bs";
import { BsSun } from "react-icons/bs";

function ThemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <ActionIcon
      onClick={() =>
        setColorScheme(computedColorScheme === "light" ? "dark" : "light")
      }
      color="dark"
      variant="transparent"
      size="lg"
      aria-label="Toggle color scheme"
    >
      {computedColorScheme === "light" ? <BsMoonStars /> : <BsSun />}
    </ActionIcon>
  );
}

export default ThemeToggle;
