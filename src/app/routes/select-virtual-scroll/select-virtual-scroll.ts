import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  CdkBoostKitTemplateType,
  MaterialSelectVirtualScroll,
  MaterialSelectVirtualScrollConfig,
} from 'angular-boost-kit';
import { delay, of } from 'rxjs';
import {
  APICitiesItem,
  APIStatesCitiesNeighborhoods,
  APIStatesItem,
} from './api-services/states-cities-neighborhoods';
import { SharedModules } from '../../shared.modules';

interface ProductOption {
  id: number;
  name: string;
  category: string;
}

interface CompositeOption {
  countryId: number;
  regionId: number;
  description: string;
}

@Component({
  selector: 'app-select-virtual-scroll',
  imports: [SharedModules, MaterialSelectVirtualScroll, CdkBoostKitTemplateType],
  templateUrl: './select-virtual-scroll.html',
  styleUrl: './select-virtual-scroll.scss',
})
export class SelectVirtualScroll {
  private readonly locations = inject(APIStatesCitiesNeighborhoods);

  readonly stateControl = new FormControl<string | null>(null);
  readonly cityControl = new FormControl<number | null>(null);
  readonly productControl = new FormControl<number[]>([1, 2, 6], { nonNullable: true });
  readonly compositeControl = new FormControl<CompositeOption | null>(null);
  readonly compositeFields = new FormGroup({
    countryId: new FormControl<number | null>(null),
    regionId: new FormControl<number | null>(null),
  });

  readonly statesConfig: MaterialSelectVirtualScrollConfig<APIStatesItem> = {
    formControl: this.stateControl,
    compositeId: ['stateId'],
    optionItemDescription: 'stateName',
    replaceArrowByResetButton: true,
    load: () => this.locations.getStates(),
  };

  readonly citiesConfig: MaterialSelectVirtualScrollConfig<APICitiesItem> = {
    formControl: this.cityControl,
    compositeId: ['cityId'],
    optionItemDescription: 'cityName',
    populateBasedOnFormControls: [this.stateControl],
    load: () => this.locations.getCities(this.stateControl.value!),
  };

  readonly products: ProductOption[] = Array.from({ length: 1000 }, (_, index) => ({
    id: index + 1,
    name: `Produto ${index + 1}`,
    category: ['Eletrônicos', 'Casa', 'Escritório'][index % 3],
  }));

  readonly productsConfig: MaterialSelectVirtualScrollConfig<ProductOption> = {
    formControl: this.productControl,
    multiple: true,
    compositeId: ['id'],
    optionItemDescription: 'name',
    replaceArrowByResetButton: true,
    load: () => of(this.products).pipe(delay(350)),
  };

  readonly compositeOptions: CompositeOption[] = Array.from(
    { length: 100 },
    (_, index) => ({
      countryId: index < 50 ? 1 : 2,
      regionId: (index % 50) + 1,
      description: `Região ${(index % 50) + 1} — País ${index < 50 ? 'A' : 'B'}`,
    }),
  );

  readonly compositeConfig: MaterialSelectVirtualScrollConfig<CompositeOption> = {
    formControl: this.compositeControl,
    compositeId: ['countryId', 'regionId'],
    optionItemDescription: 'description',
    compositeIdPopulateFormGroup: this.compositeFields,
    load: () => of(this.compositeOptions).pipe(delay(250)),
  };

  readonly basicHtml = `<boostkit-material-select-virtual-scroll
  [config]="statesConfig"
></boostkit-material-select-virtual-scroll>`;

  readonly basicTypescript = `statesConfig: MaterialSelectVirtualScrollConfig<State> = {
  formControl: new FormControl<string | null>(null),
  compositeId: ['stateId'],
  optionItemDescription: 'stateName',
  load: () => this.api.getStates(),
};`;

  readonly dependentHtml = `<boostkit-material-select-virtual-scroll
  [config]="statesConfig"
></boostkit-material-select-virtual-scroll>

<boostkit-material-select-virtual-scroll
  [config]="citiesConfig"
></boostkit-material-select-virtual-scroll>`;

  readonly multipleTypescript = `productsConfig: MaterialSelectVirtualScrollConfig<Product> = {
  formControl: new FormControl<number[]>([], { nonNullable: true }),
  multiple: true,
  compositeId: ['id'],
  optionItemDescription: 'name',
  load: () => this.api.getProducts(),
};`;

  readonly compositeTypescript = `type RegionId = Pick<Region, 'countryId' | 'regionId'>;

compositeConfig: MaterialSelectVirtualScrollConfig<Region> = {
  formControl: new FormControl<RegionId | null>(null),
  compositeId: ['countryId', 'regionId'],
  optionItemDescription: 'description',
  compositeIdPopulateFormGroup: this.regionFields,
  load: () => this.api.getRegions(),
};`;

  readonly customTemplateHtml = `<boostkit-material-select-virtual-scroll
  [config]="statesConfig"
  [optionTemplate]="optionTemplate"
  [triggerTemplate]="triggerTemplate"
>
  <ng-template #optionTemplate let-templateData="templateData">
    <strong>{{ templateData.data.stateName }}</strong>
    <small>{{ templateData.data.stateId }}</small>
  </ng-template>

  <ng-template #triggerTemplate let-templateData="templateData">
    {{ templateData?.data?.stateName ?? 'Selecione um estado' }}
  </ng-template>
</boostkit-material-select-virtual-scroll>`;

  readonly configProperties = [
    {
      name: 'formControl',
      type: 'FormControl',
      description: 'Controla valor, validação e estado habilitado. Guarda o ID selecionado (ou uma lista no modo múltiplo).',
      required: true,
    },
    {
      name: 'load',
      type: '() => Observable<T[]>',
      description: 'Carrega as opções. Chamado ao iniciar ou quando todos os controles de dependência tiverem valor.',
      required: true,
    },
    {
      name: 'compositeId',
      type: 'Array<keyof T>',
      description: 'Chaves que formam a identidade de cada opção. Na prática, informe ao menos uma chave.',
      required: true,
    },
    {
      name: 'optionItemDescription',
      type: 'keyof T',
      description: 'Propriedade textual usada como rótulo padrão e como campo da busca.',
      required: true,
    },
    {
      name: 'multiple',
      type: 'boolean',
      description: 'Habilita múltipla seleção; o valor do controle passa a ser uma lista de IDs.',
      required: false,
    },
    {
      name: 'hideResetOption',
      type: 'boolean',
      description: 'Oculta a opção “None” do painel. O valor padrão é false.',
      required: false,
    },
    {
      name: 'replaceArrowByResetButton',
      type: 'boolean',
      description: 'Substitui a seta por um botão de limpar quando há valor; também oculta “None”.',
      required: false,
    },
    {
      name: 'populateBasedOnFormControls',
      type: 'FormControl[]',
      description: 'Controles dependentes. O select inicia desabilitado, limpa a seleção e recarrega quando um deles muda.',
      required: false,
    },
    {
      name: 'compositeIdPopulateFormGroup',
      type: 'FormGroup',
      description: 'No modo simples com ID composto, preenche os controles do grupo com as chaves selecionadas.',
      required: false,
    },
    {
      name: 'templateDataOptionMeta',
      type: 'OptionMetaData<T>',
      description: 'Token de contexto de template para tipagem Angular; não é um output.',
      required: false,
    },
    {
      name: 'templateDataMultipleOptionMeta',
      type: 'OptionMetaData<T>[]',
      description: 'Token de contexto de template múltiplo para tipagem Angular; não é um output.',
      required: false,
    },
  ];

  readonly componentInputs = [
    {
      name: 'config',
      type: 'MaterialSelectVirtualScrollConfig<T>',
      description: 'Obrigatório. Configuração do formulário, opções, carregamento e apresentação.',
    },
    {
      name: 'optionTemplate',
      type: 'TemplateRef<any>',
      description: 'Template opcional para cada opção no painel. Substitui o rótulo padrão.',
    },
    {
      name: 'triggerTemplate',
      type: 'TemplateRef<any>',
      description: 'Template opcional do valor selecionado; tem precedência sobre optionTemplate no trigger.',
    },
  ];

  readonly valueFormats = [
    { mode: 'Simples, uma chave', format: 'Valor da chave de ID', example: '42 ou "SP"' },
    { mode: 'Múltiplo, uma chave', format: 'Array de valores da chave de ID', example: '[1, 2, 6]' },
    { mode: 'Simples, ID composto', format: 'Objeto com todas as chaves', example: '{ countryId: 1, regionId: 3 }' },
    { mode: 'Múltiplo, ID composto', format: 'Array de objetos de ID', example: '[{ countryId: 1, regionId: 3 }]' },
  ];

  readonly componentInputColumns = ['name', 'type', 'description'];
  readonly configPropertyColumns = ['name', 'type', 'required', 'description'];
  readonly valueFormatColumns = ['mode', 'format', 'example'];
}
