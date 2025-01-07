import { useState } from 'react';
import {Box, CheckIcon, Combobox, Container, Group, Pill, PillsInput, ScrollArea, useCombobox} from '@mantine/core';

import { trueLeafCropTypes } from "../../helpers/true-leaf-crop-types.ts";

interface CropsPageProps {
  inputKey: string;
  inputProps: object;
  setFieldValue: (fieldValue: string[]) => void;
}

function TrueLeafCropsPage(props: CropsPageProps) {

  const { inputKey, inputProps, setFieldValue } = props;

  const [ value, setValue ] = useState<string[]>([])

  const combobox = useCombobox({
    onDropdownClose: () => {
      setIsDropdownOpen(false)
      combobox.resetSelectedOption()
    },
    onDropdownOpen: () => {
      setIsDropdownOpen(true)
      combobox.updateSelectedOptionIndex('active')
    },
  });

  const [search, setSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const options = Object.keys(trueLeafCropTypes)
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
    <Container p={0}>
      <Combobox store={combobox} onOptionSubmit={handleValueSelect} withinPortal={false} >
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
            <ScrollArea.Autosize mah={200} type="scroll">
              {options.length > 0 ? options : <Combobox.Empty>Nothing found...</Combobox.Empty>}
            </ScrollArea.Autosize>
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
      <Box style={{transition: ".25s", height: isDropdownOpen ? "212px" : "0px"}}/>
    </Container>
  );
}

export default TrueLeafCropsPage;
