export type RollBreakdown = {
  dice: number[];
  sum: number;
  modifier: number;
  total: number;
};

export function roll3d6(modifier = 0, rng: () => number = Math.random): RollBreakdown {
  const d = () => Math.floor(rng() * 6) + 1;
  const dice = [d(), d(), d()];
  const sum = dice[0] + dice[1] + dice[2];
  const total = sum + modifier;
  return { dice, sum, modifier, total };
}
