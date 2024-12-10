import { useState } from 'react';
import { CheckIcon, Combobox, Group, Pill, PillsInput, useCombobox } from '@mantine/core';

import { groceries } from "./input-types.ts"

  interface CropsPageProps {
  inputKey: string;
  inputProps: object;
  setFieldValue: (fieldValue: string[]) => void;
}

function CropsPage(props: CropsPageProps) {

  const { inputKey, inputProps, setFieldValue } = props;

  const [ value, setValue ] = useState<string[]>([])

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  });

  const [search, setSearch] = useState('');

  const handleValueSelect = (val: string) => {
    const newValue = value.includes(val) ? value.filter((v) => v !== val) : [...value, val]
    setValue(newValue);
    setFieldValue(newValue);
  }

  const handleValueRemove = (val: string) => {
    const newValue: string[] = value.filter((v) => v !== val);
    setValue(newValue);
    setFieldValue(newValue);
  }

  const values = value.map((item) => (
    <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
      {item}
    </Pill>
  ));

  const options = groceries
    .filter((item) => item.toLowerCase().includes(search.trim().toLowerCase()))
    .map((item) => (
      <Combobox.Option value={item} key={item} active={value.includes(item)}>
        <Group gap="sm">
          {value.includes(item) ? <CheckIcon size={12} /> : null}
          <span>{item}</span>
        </Group>
      </Combobox.Option>
    ));

  return (
    <Combobox store={combobox} onOptionSubmit={handleValueSelect} withinPortal={false}>
      <Combobox.DropdownTarget>
        <PillsInput
          label="What crops are you interested in growing?"
          onClick={() => combobox.openDropdown()}
          key={inputKey}
          {...inputProps}
        >
          <Pill.Group>
            {values}

            <Combobox.EventsTarget>
              <PillsInput.Field
                onFocus={() => combobox.openDropdown()}
                onBlur={() => combobox.closeDropdown()}
                value={search}
                placeholder="Search values"
                onChange={(event) => {
                  combobox.updateSelectedOptionIndex();
                  setSearch(event.currentTarget.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Backspace' && search.length === 0) {
                    event.preventDefault();
                    handleValueRemove(value[value.length - 1]);
                  }
                }}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options.length > 0 ? options : <Combobox.Empty>Nothing found...</Combobox.Empty>}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

export default CropsPage;
