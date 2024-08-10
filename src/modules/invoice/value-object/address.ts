type AddressProps = {
  street: string;
  number: number;
  complement?: string;
  zip: string;
  city: string;
  state: string;
};

export default class Address {
  private _street: string;
  private _number: number;
  private _complement: string;
  private _zip: string;
  private _city: string;
  private _state: string;

  constructor({ street, number, complement, zip, city, state }: AddressProps) {
    this._street = street;
    this._number = number || 0;
    this._complement = complement || '';
    this._zip = zip;
    this._city = city;
    this._state = state;

    this.validate();
  }

  get street(): string {
    return this._street;
  }

  get number(): number {
    return this._number;
  }

  get complement(): string {
    return this._complement;
  }

  get zip(): string {
    return this._zip;
  }

  get city(): string {
    return this._city;
  }

  get state(): string {
    return this._state;
  }
  
  validate() {
    if (this._street.length === 0) {
      throw new Error("Street is required");
    }
    if (this._number === 0) {
      throw new Error("Number is required");
    }
    if (this._zip.length === 0) {
      throw new Error("Zip is required");
    }
    if (this._city.length === 0) {
      throw new Error("City is required");
    }
    if (this._state.length === 0) {
      throw new Error("State is required");
    }
  }
}
