import { ChangeDetectionStrategy, Component, computed, forwardRef, input, output, signal } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Component({
  selector: 'shared-input',
  imports: [],
  templateUrl: './input.html',
  styleUrl: './input.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Input),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => Input),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Input implements ControlValueAccessor, Validator {
  value = signal('');
  lastValid = signal('');
  placeholder = input('');
  pattern = input<string | undefined>(undefined);
  focusOut = output<Event>();
  enterPressed = output<void>();

  private patternRegex = computed(() => {
    const pat = this.pattern();
    if (!pat) return undefined;
    try {
      return typeof pat === 'string' ? new RegExp(pat) : pat;
    } catch {
      return undefined;
    }
  });

  private touched = signal(false);
  private dirty = signal(false);

  errorMessage = computed(() => {
    const v = this.value() ?? '';

    const pat = this.pattern();
    if (pat) {
      try {
        const re = typeof pat === 'string' ? new RegExp(pat) : pat;
        if (!re.test(v)) return 'Value does not match the required format.';
        // eslint-disable-next-line no-empty
      } catch {}
    }
    return '';
  });

  hasError = computed(() => !!this.errorMessage() && (this.touched() || this.dirty()));

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (val: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => {};
  updateField($event: KeyboardEvent) {
    if ($event.key === 'Enter') {
      this.enterPressed.emit();
    }
  }
  handleFocus($event: Event) {
    this.focusOut.emit($event);
  }
  writeValue(val: string): void {
    const next = val ?? '';
    this.value.set(next);
    this.lastValid.set(next);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  handleInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const val = inputEl.value;
    const re = this.patternRegex();

    if (re && val && !re.test(val)) {
      inputEl.value = this.lastValid(); // revert visible value
      return;
    }
    this.value.set(val);
    this.dirty.set(true);
    this.lastValid.set(val);
    this.onChange(val);
  }

  handleBlur(): void {
    this.touched.set(true);
    this.onTouched();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const v: string = (control?.value ?? '') as string;

    const errors: ValidationErrors = {};
    const pat = this.pattern();
    if (pat) {
      try {
        const re = typeof pat === 'string' ? new RegExp(pat) : pat;

        if (!re.test(v)) errors['pattern'] = { requiredPattern: pat, actualValue: v };
      } catch {
        // ignore invalid regex
      }
    }
    return Object.keys(errors).length ? errors : null;
  }
}
