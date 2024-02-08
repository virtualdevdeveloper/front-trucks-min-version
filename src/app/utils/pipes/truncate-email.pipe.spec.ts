import { TruncateEmailPipe } from './truncate-email.pipe';

describe('TruncateEmailPipe', () => {
  it('create an instance', () => {
    const pipe = new TruncateEmailPipe();
    expect(pipe).toBeTruthy();
  });
});
