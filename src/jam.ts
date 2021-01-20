export class Jam {
  public flash: number = 0;
  public intensity: number = 0;
  public atmospheric = false;

  private previous: number[] = [];

  update(freqs: number[]) {
    let amt = 0;
    //let bassSample = 10;
    let bassSample = freqs.length;
    for (let i = 0; i < bassSample; ++i) {
      amt += freqs[i] / bassSample;
    }
    let lowSample = 0;
    let highSample = 0;
    const lowCutoff = freqs.length * 0.3;
    for (let i = 0; i < freqs.length; i += 10) {
      if (i < lowCutoff) {
        lowSample += freqs[i];
      } else {
        highSample += freqs[i];
      }
    }
    this.atmospheric = lowSample > highSample * 3;
    this.sample(amt);
    if (!this.atmospheric) {
      this.intensity += (this.flash * this.flash);
    }
    this.intensity *= 0.9;
  }

  sample(amount: number) {
    this.previous.push(amount);
    if (this.previous.length > 30) {
      this.previous.splice(0, 1);
    }
    let min = this.previous[0];
    let max = this.previous[0];
    for (let i = 1; i < this.previous.length; ++i) {
      if (this.previous[i] < min) min = this.previous[i];
      if (this.previous[i] > max) max = this.previous[i];
    }
    if (max == 0 || min == max) {
      amount = 0;
    } else {
      amount -= min;
      amount /= (max - min);
    }
    if (amount < 0) amount = 0;
    if (amount > 1) amount = 1;
    this.flash = amount;
  }
}