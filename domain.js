import { randomInt } from "crypto";

export function roll(value = 99) {
    return randomInt(value) + 1;
}