import { css } from "../lib/atomic";

export function Counter() {
    return (
        <div class={css({ margin: "1rem", fontSize: "4rem", fontFamily: "arial" })}>
            <button>Increment</button>
            Toto
            <button class={css({ color: "blue", sm: { fontWeight: "900" }, md: { color: "yellow" } })}>Increment</button>
        </div>
    )
}