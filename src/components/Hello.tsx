import { css } from "../lib/atomic";

const Colors = {
    green: "#123456"
} as const

export function Hello() {
    return (
        <div class={css({
            padding: "2rem",
            backgroundColor: "#123456",
            color: Colors.green,
            hover: { backgroundColor: "red" },
            sm: { backgroundColor: "yellow" }
        })}>
            Hello <strong>Toto</strong>

            <a href="/toto" class={css({ visited: { color: "green" } })}>Toto</a>
        </div>
    )
}