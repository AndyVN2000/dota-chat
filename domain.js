import { randomInt } from "crypto";

export function roll(value = 100) {
    return randomInt(value) + 1;
}