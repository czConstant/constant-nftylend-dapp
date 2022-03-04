import { Button, Tooltip } from "react-bootstrap";
import { useEthereumProvider } from "../contexts/EthereumProviderContext";

const EthereumSignerKey = () => {
  const { connect, disconnect, signerAddress, providerError } = useEthereumProvider();
  const connected = !!signerAddress;
  const pk = signerAddress || '';
  const is0x = pk.startsWith("0x");

  return <>
    {connected ? (
      <Tooltip title={pk}>
        <Button onClick={disconnect}>
          Disconnect {pk.substring(0, is0x ? 6 : 3)}...
          {pk.substr(pk.length - (is0x ? 4 : 3))}
        </Button>
      </Tooltip>
    ) : (
      <Button onClick={connect}>
        Connect
      </Button>
    )}
    <div>{providerError}</div>
  </>
};

export default EthereumSignerKey;
