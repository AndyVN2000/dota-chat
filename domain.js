import { randomInt } from "crypto";

export function roll() {
    return randomInt(99) + 1;
}