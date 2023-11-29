import { css } from "../lib/atomic";

export function Hello() {
    return (
        <div class={css({ padding: "2rem", backgroundColor: "#123456", hover: { backgroundColor: "red" } })}>
            Hello <strong>Toto</strong>

            <a href="/toto" class={css({ visited: { color: "green" } })}>Toto</a>
        </div>
    )
}