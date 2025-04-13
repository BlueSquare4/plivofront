// components/ui/DropdownMenu.tsx
import { Menu } from '@headlessui/react';
import { Button } from './button';

interface Option {
  label: string;
  value: any;
}

interface DropdownMenuProps {
  options: Option[];
  onSelect: (option: Option) => void;
}

export default function DropdownMenu({ options, onSelect }: DropdownMenuProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button as={Button} variant="outline" size="sm">
          More Actions
        </Menu.Button>
      </div>

      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 bg-white border rounded-md shadow-lg">
        {options.map((option, index) => (
          <Menu.Item key={index}>
            {({ active }) => (
              <button
                onClick={() => onSelect(option)}
                className={`${
                  active ? 'bg-blue-500 text-white' : 'text-gray-900'
                } w-full text-left px-4 py-2 cursor-pointer`}
              >
                {option.label}
              </button>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
}