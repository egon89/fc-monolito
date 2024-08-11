import UseCaseInterface from '../../@shared/usecase/use-case.interface';
import InvoiceFacadeInterface, {
  FindInvoiceFacadeInputDto,
  FindInvoiceFacadeOutputDto,
  GenerateInvoiceFacadeInputDto,
  GenerateInvoiceFacadeOutputDto
} from './invoice.facade.interface';

export interface InvoiceFacadeProps {
  generateInvoiceUseCase: UseCaseInterface;
  findInvoiceUseCase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
  private _generateInvoiceUseCase: UseCaseInterface;
  private _findInvoiceUseCase: UseCaseInterface;

  constructor(usecasesProps: InvoiceFacadeProps) {
    this._generateInvoiceUseCase = usecasesProps.generateInvoiceUseCase;
    this._findInvoiceUseCase = usecasesProps.findInvoiceUseCase;
  }

  generate(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
    return this._generateInvoiceUseCase.execute(input);
  }

  find(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto> {
    return this._findInvoiceUseCase.execute(input);
  }
}
